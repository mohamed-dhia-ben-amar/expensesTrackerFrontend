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
import { Button } from '../../src/components/ui/Button';
import { useTheme } from '../../src/hooks/themeHooks/useTheme';
import { Spacing } from '../../src/theme/spacing';
import { Typography } from '../../src/theme/typography';
import { LinearGradient } from 'expo-linear-gradient';
import { authEndpoints } from '../../src/services/endpoints';

export default function VerifyEmailScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { email } = useLocalSearchParams<{ email: string }>();
    
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const inputRefs = useRef<TextInput[]>([]);

    const handleOtpChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return; // Only digits

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            Alert.alert('Error', 'Please enter the complete 6-digit code');
            return;
        }

        setIsVerifying(true);
        try {
            await authEndpoints.confirmVerification({ email: email || '', otp: otpCode });
            Alert.alert('Success', 'Email verified successfully!', [
                { text: 'OK', onPress: () => router.replace('/(auth)/login') }
            ]);
        } catch (error: any) {
            Alert.alert('Verification Failed', error?.response?.data?.message || 'Invalid or expired OTP');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        try {
            const response = await authEndpoints.requestVerification({ email: email || '' });
            Alert.alert('Success', 'A new verification code has been sent to your email');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (error: any) {
            Alert.alert('Error', error?.response?.data?.message || 'Failed to resend code');
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
                        <Text style={[styles.title, { color: colors.text }]}>Verify Your Email</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            We've sent a 6-digit code to
                        </Text>
                        <Text style={[styles.email, { color: colors.text }]}>{email}</Text>
                    </View>

                    <View style={[styles.formCard, { backgroundColor: colors.card || colors.background }]}>
                        <Text style={[styles.label, { color: colors.text }]}>Enter Code</Text>
                        
                        <View style={styles.otpContainer}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => {
                                        if (ref) inputRefs.current[index] = ref;
                                    }}
                                    style={[
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

                        <Button
                            title="Verify Email"
                            onPress={handleVerify}
                            loading={isVerifying}
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
    },
    label: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.semibold,
        textAlign: 'center',
        marginBottom: Spacing.lg,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.xl,
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
        marginBottom: Spacing.lg,
    },
    resendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    resendText: {
        fontSize: Typography.fontSize.md,
    },
});
