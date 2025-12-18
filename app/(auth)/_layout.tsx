import { Stack, Redirect } from 'expo-router';
import { LoadingScreen } from '../../src/components/ui/LoadingScreen';
import { useAuth } from '../../src/hooks/authHooks/useAuth';

export default function AuthLayout() {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    // Only redirect to tabs if authenticated AND verified
    // Allow unverified users to stay in auth stack to complete verification
    if (isAuthenticated && user?.isVerified) {
        return <Redirect href="/(tabs)" />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" options={{ gestureEnabled: false }} />
            <Stack.Screen name="register" options={{ gestureEnabled: false }} />
            <Stack.Screen name="verify-email" options={{ gestureEnabled: false }} />
            <Stack.Screen name="forgot-password" options={{ gestureEnabled: false }} />
            <Stack.Screen name="reset-password" options={{ gestureEnabled: false }} />
        </Stack>
    );
}