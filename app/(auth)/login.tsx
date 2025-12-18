import React, { useCallback, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useAuth } from '../../src/hooks/authHooks/useAuth';
import { useTheme } from '../../src/hooks/themeHooks/useTheme';
import { Spacing } from '../../src/theme/spacing';
import { Typography } from '../../src/theme/typography';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { showApiErrorAlert } from '@/utils/apiError';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { login, isLoggingIn } = useAuth();
    const [rememberMe, setRememberMe] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    // Load saved credentials on mount
    useEffect(() => {
        const loadSavedCredentials = async () => {
            try {
                const saved = await AsyncStorage.getItem('savedCredentials');
                if (saved) {
                    const { email, password } = JSON.parse(saved);
                    setValue('email', email);
                    setValue('password', password);
                    setRememberMe(true);
                }
            } catch (error) {
                console.error('Failed to load saved credentials:', error);
            }
        };
        loadSavedCredentials();
    }, [setValue]);

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data);
            
            // Save or clear credentials based on rememberMe
            if (rememberMe) {
                await AsyncStorage.setItem('savedCredentials', JSON.stringify({
                    email: data.email,
                    password: data.password,
                }));
            } else {
                await AsyncStorage.removeItem('savedCredentials');
            }
            
            router.replace('/(tabs)');
        } catch (error) {
            showApiErrorAlert(error, { fallbackMessage: 'Login failed' });
        }
    };

    // Block Android hardware back on login to avoid navigating back to register
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => true; // consume event
            const sub = Platform.OS === 'android'
                ? (require('react-native') as any).BackHandler.addEventListener('hardwareBackPress', onBackPress)
                : null;
            return () => {
                sub?.remove?.();
            };
        }, [])
    );

    return (
        <LinearGradient
            colors={[colors.primary || '#4F46E5', colors.background || '#F3F4F6']} // Adjust to your theme's primary color
            style={styles.gradient}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Logo / Illustration */}
                    <Image
                        source={require('../../assets/logo.png')} // Replace with your expense tracker logo or illustration
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Sign in to continue tracking your expenses
                        </Text>
                    </View>

                    {/* Form Card */}
                    <View style={[styles.formCard, { backgroundColor: colors.card || colors.background }]}>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Email"
                                    placeholder="your@email.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.email?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Password"
                                    placeholder="••••••••"
                                    secureTextEntry
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.password?.message}
                                />
                            )}
                        />

                        {/* Remember Me & Forgot Password */}
                        <View style={styles.optionsRow}>
                            <TouchableOpacity 
                                style={styles.rememberMe}
                                onPress={() => setRememberMe(!rememberMe)}
                            >
                                <View style={[styles.checkbox, { borderColor: colors.border }]}>
                                    {rememberMe && (
                                        <View style={[styles.checkboxInner, { backgroundColor: colors.primary }]} />
                                    )}
                                </View>
                                <Text style={[styles.rememberText, { color: colors.text }]}>
                                    Remember me
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.forgotPassword}
                                onPress={() => router.push('/(auth)/forgot-password')}
                            >
                                <Text style={[styles.forgotText, { color: colors.primary }]}>
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Button
                            title="Sign In"
                            onPress={handleSubmit(onSubmit)}
                            loading={isLoggingIn}
                            fullWidth
                            size="lg"
                            style={styles.button}
                        />

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                                Don't have an account?{' '}
                            </Text>
                            <Button
                                title="Sign Up"
                                onPress={() => router.replace('/(auth)/register')}
                                variant="ghost"
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    logo: {
        width: 240,
        height: 240,
        alignSelf: 'center'
    },
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    title: {
        fontSize: Typography.fontSize['4xl'],
        fontWeight: Typography.fontWeight.bold,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    subtitle: {
        fontSize: Typography.fontSize.lg,
        textAlign: 'center',
    },
    formCard: {
        borderRadius: 24,
        padding: Spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        gap: Spacing.lg,
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: -Spacing.sm,
        marginBottom: Spacing.md,
    },
    rememberMe: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxInner: {
        width: 12,
        height: 12,
        borderRadius: 2,
    },
    rememberText: {
        fontSize: Typography.fontSize.sm,
    },
    forgotPassword: {},
    forgotText: {
        fontSize: Typography.fontSize.sm,
        fontWeight: '600',
    },
    button: {
        marginTop: Spacing.md,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.xl,
    },
    footerText: {
        fontSize: Typography.fontSize.md,
    },
});