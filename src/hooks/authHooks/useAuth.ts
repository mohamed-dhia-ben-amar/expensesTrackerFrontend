import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authEndpoints } from "../../services/endpoints";
import { LoginRequest, SignupRequest } from "../../types/api.types";
import { jwtDecode } from "jwt-decode";

type TokenClaims = {
    firstName?: string;
    lastName?: string;
    email?: string;
    verified?: boolean;
    isVerified?: boolean;
    sub?: string;
    id?: string;
    _id?: string;
    [key: string]: any;
};

const getUserFromToken = (accessToken?: string) => {
    if (!accessToken) return null;
    try {
        const claims = jwtDecode<TokenClaims>(accessToken);
        const _id = claims._id || claims.id || claims.sub || undefined;
        const email = claims.email || undefined;
        const firstName = claims.firstName || undefined;
        const lastName = claims.lastName || undefined;
        const isVerified = claims.verified ?? claims.isVerified ?? false;
        if (!_id && !email && !firstName && !lastName) return null;
        return { _id, email, firstName, lastName, isVerified } as any;
    } catch (e) {
        // Invalid token or unexpected format
        return null;
    }
};

export const useAuth = () => {
    const queryClient = useQueryClient();

    // Get current user from storage
    const { data: user, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const [storedUserStr, accessToken] = await AsyncStorage.multiGet(["user", "accessToken"]).then((pairs) => [pairs?.[0]?.[1], pairs?.[1]?.[1]]);
            const tokenUser = getUserFromToken(accessToken || undefined);
            const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
            const mergedUser = tokenUser
                ? { ...(storedUser || {}), ...tokenUser }
                : storedUser;
            if (mergedUser) {
                await AsyncStorage.setItem("user", JSON.stringify(mergedUser));
            }
            return mergedUser;
        },
        staleTime: Infinity, // User data doesn't change often
    });

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: async (credentials: LoginRequest) => {
            // Backend returns { status: 'success', response, accessToken, refreshToken }
            const res: any = await authEndpoints.login(credentials);
            const ok = (res as any)?.status === 'success' || (res as any)?.success === true;
            if (!ok) {
                throw new Error((res as any)?.message || 'Login failed');
            }

            const accessToken = (res as any)?.data?.accessToken || (res as any)?.accessToken;
            const refreshToken = (res as any)?.data?.refreshToken || (res as any)?.refreshToken;
            if (!accessToken) {
                throw new Error('Missing accessToken in login response');
            }
            await AsyncStorage.multiSet([["accessToken", accessToken], ["refreshToken", refreshToken || '']]);

            // Prefer names and email from token; fallback to existing user or credentials
            const tokenUser = getUserFromToken(accessToken);
            const storedUserStr = await AsyncStorage.getItem('user');
            const existing = storedUserStr ? JSON.parse(storedUserStr) : null;
            const nextUser = tokenUser || existing || { email: credentials.email };
            await AsyncStorage.setItem('user', JSON.stringify(nextUser));
            return { user: nextUser, accessToken, refreshToken } as any;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["user"], data.user);
        },
        onError: (error: Error) => {
            console.error("Login error:", error);
        },
    });

    // Register mutation
    const registerMutation = useMutation({
        mutationFn: async (userData: SignupRequest) => {
            // Backend signup returns { status: 'success', response, data: { id, email } }
            const signupRes: any = await authEndpoints.register(userData);

            const isOk = (signupRes as any)?.status === 'success' || (signupRes as any)?.success === true;
            if (!isOk) {
                throw new Error((signupRes as any)?.message || 'Registration failed');
            }

            // Immediately sign in to obtain tokens and full user object
            const loginRes: any = await authEndpoints.login({ email: userData.email, password: userData.password });
            const loginOk = (loginRes as any)?.status === 'success' || (loginRes as any)?.success === true;
            if (!loginOk) {
                throw new Error((loginRes as any)?.message || 'Login after signup failed');
            }

            const accessToken = (loginRes as any)?.data?.accessToken || (loginRes as any)?.accessToken;
            const refreshToken = (loginRes as any)?.data?.refreshToken || (loginRes as any)?.refreshToken;
            await AsyncStorage.multiSet([["accessToken", accessToken], ["refreshToken", refreshToken || '']]);

            // Build user from token if present, otherwise from signup payload/response
            const tokenUser = getUserFromToken(accessToken);
            const fallbackUser = {
                _id: (signupRes as any)?.data?.id,
                email: (signupRes as any)?.data?.email || userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                dateOfBirth: userData.dateOfBirth,
                placeOfBirth: userData.placeOfBirth,
            } as any;
            const userObj = tokenUser ? { ...fallbackUser, ...tokenUser } : fallbackUser;
            await AsyncStorage.setItem("user", JSON.stringify(userObj));

            return { user: userObj, accessToken, refreshToken } as any;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["user"], data.user);
        },
        onError: (error: Error) => {
            console.error("Registration error:", error);
        },
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: async () => {
            try {
                await authEndpoints.logout();
            } catch (error) {
                // Continue with logout even if API call fails
                console.error("Logout API error:", error);
            } finally {
                await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
            }
        },
        onSuccess: () => {
            queryClient.setQueryData(["user"], null);
            queryClient.clear();
        },
    });

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        isRegistering: registerMutation.isPending,
    };
};
