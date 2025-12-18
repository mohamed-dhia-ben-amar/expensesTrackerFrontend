import React, { useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/authHooks/useAuth';
import { authEndpoints } from '@/services/endpoints';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/themeHooks/useTheme';
import { Button } from '@/components/ui/Button';
import { showApiErrorAlert } from '@/utils/apiError';

export default function VerificationRequiredScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { user } = useAuth();
    const [isResending, setIsResending] = React.useState(false);

    const handleResendVerification = async () => {
        if (!user?.email) return;

        setIsResending(true);
        try {
            await authEndpoints.requestVerification({ email: user.email });
            alert('Verification code sent to your email');
        } catch (error: any) {
            showApiErrorAlert(error, { fallbackMessage: 'Failed to send verification code' });
        } finally {
            setIsResending(false);
        }
    };

    const handleVerify = () => {
        router.push({
            pathname: '/(auth)/verify-email',
            params: { email: user?.email || '' }
        });
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
            colors={[colors.primary || '#4F46E5', colors.background || '#F3F4F6']}
            style={styles.gradient}
        >
            <View style={styles.container}>
                <View style={[styles.card, { backgroundColor: colors.card || colors.background }]}>
                    <Text style={[styles.icon]}>✉️</Text>
                    <Text style={[styles.title, { color: colors.text }]}>
                        Email Verification Required
                    </Text>
                    <Text style={[styles.message, { color: colors.textSecondary }]}>
                        Please verify your email address to access all features of the app.
                    </Text>
                    <Text style={[styles.email, { color: colors.text }]}>
                        {user?.email}
                    </Text>

                    <Button
                        title="Verify Now"
                        onPress={handleVerify}
                        fullWidth
                        size="lg"
                        style={styles.button}
                    />

                    <TouchableOpacity onPress={handleResendVerification} disabled={isResending}>
                        <Text style={[styles.resendText, { color: colors.primary }]}>
                            {isResending ? 'Sending...' : 'Resend Verification Code'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 24,
        padding: Spacing.xxl,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    icon: {
        fontSize: 64,
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: Typography.fontSize['2xl'],
        fontWeight: Typography.fontWeight.bold,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    message: {
        fontSize: Typography.fontSize.md,
        textAlign: 'center',
        marginBottom: Spacing.lg,
        lineHeight: 22,
    },
    email: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.semibold,
        textAlign: 'center',
        marginBottom: Spacing.xl,
    },
    button: {
        marginBottom: Spacing.lg,
    },
    resendText: {
        fontSize: Typography.fontSize.md,
        fontWeight: Typography.fontWeight.semibold,
    },
});
