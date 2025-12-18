import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useTheme } from '../../src/hooks/themeHooks/useTheme';
import { Spacing } from '../../src/theme/spacing';
import { Typography } from '../../src/theme/typography';
import { LinearGradient } from 'expo-linear-gradient';
import { authEndpoints } from '../../src/services/endpoints';
import { showApiErrorAlert } from '@/utils/apiError';

const resetPasswordSchema = z.object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { email } = useLocalSearchParams<{ email: string }>();
    
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isResetting, setIsResetting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
    });

    const handleOtpChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const onSubmit = async (data: ResetPasswordFormData) => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            Alert.alert('Error', 'Please enter the complete 6-digit code');
            return;
        }

        setIsResetting(true);
        try {
            await authEndpoints.resetPassword({
                email: email || '',
                otp: otpCode,
                newPassword: data.newPassword
            });
            Alert.alert(
                'Password Reset Successfully',
                'You can now sign in with your new password',
                [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
            );
        } catch (error: any) {
            showApiErrorAlert(error, { title: 'Reset Failed', fallbackMessage: 'Invalid or expired code' });
        } finally {
            setIsResetting(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        try {
            await authEndpoints.forgotPassword({ email: email || '' });
            Alert.alert('Success', 'A new reset code has been sent to your email');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (error: any) {
            showApiErrorAlert(error, { title: 'Error', fallbackMessage: 'Failed to resend code' });
        } finally {
            setIsResending(false);
        }
    };

    return (
        <LinearGradient
            colors={[colors.primary || '#4F46E5', colors.background || '#F3F4F6']}
            style={styles.gradient}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Enter the code sent to
                        </Text>
                        <Text style={[styles.email, { color: colors.text }]}>{email}</Text>
                    </View>

                    <View style={[styles.formCard, { backgroundColor: colors.card || colors.background }]}>
                        <Text style={[styles.label, { color: colors.text }]}>Verification Code</Text>
                        
                        <View style={styles.otpContainer}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => {
                                        if (ref) inputRefs.current[index] = ref;
                                    }}                                    style={[
                                        styles.otpInput,
                                        {
                                            borderColor: digit ? colors.primary : colors.border,
                                            color: colors.text,
                                            backgroundColor: colors.background,
                                        }
                                    ]}
                                    value={digit}
                                    onChangeText={(value) => handleOtpChange(value, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    selectTextOnFocus
                                />
                            ))}
                        </View>

                        <Controller
                            control={control}
                            name="newPassword"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="New Password"
                                    placeholder="••••••••"
                                    secureTextEntry
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.newPassword?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Confirm Password"
                                    placeholder="••••••••"
                                    secureTextEntry
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.confirmPassword?.message}
                                />
                            )}
                        />

                        <Button
                            title="Reset Password"
                            onPress={handleSubmit(onSubmit)}
                            loading={isResetting}
                            fullWidth
                            size="lg"
                            style={styles.button}
                        />

                        <View style={styles.resendContainer}>
                            <Text style={[styles.resendText, { color: colors.textSecondary }]}>
                                Didn't receive the code?{' '}
                            </Text>
                            <Button
                                title="Resend"
                                onPress={handleResend}
                                loading={isResending}
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
        fontSize: Typography.fontSize.md,
        textAlign: 'center',
        marginBottom: Spacing.xs,
    },
    email: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.semibold,
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
    label: {
        fontSize: Typography.fontSize.md,
        fontWeight: Typography.fontWeight.semibold,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
        gap: Spacing.sm,
    },
    otpInput: {
        flex: 1,
        height: 56,
        borderWidth: 2,
        borderRadius: 12,
        fontSize: Typography.fontSize['2xl'],
        fontWeight: Typography.fontWeight.bold,
        textAlign: 'center',
    },
    button: {
        marginTop: Spacing.md,
    },
    resendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.md,
    },
    resendText: {
        fontSize: Typography.fontSize.md,
    },
});
