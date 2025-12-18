import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
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

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        try {
            await authEndpoints.forgotPassword({ email: data.email });
            Alert.alert(
                'Reset Code Sent',
                'A 6-digit reset code has been sent to your email',
                [
                    {
                        text: 'OK',
                        onPress: () => router.push({
                            pathname: '/(auth)/reset-password',
                            params: { email: data.email }
                        })
                    }
                ]
            );
        } catch (error: any) {
            Alert.alert('Error', error?.response?.data?.message || 'Failed to send reset code');
        } finally {
            setIsLoading(false);
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
                        <Text style={[styles.title, { color: colors.text }]}>Forgot Password?</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Enter your email and we'll send you a code to reset your password
                        </Text>
                    </View>

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

                        <Button
                            title="Send Reset Code"
                            onPress={handleSubmit(onSubmit)}
                            loading={isLoading}
                            fullWidth
                            size="lg"
                            style={styles.button}
                        />

                        <View style={styles.footer}>
                            <Button
                                title="Back to Login"
                                onPress={() => router.back()}
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
        paddingHorizontal: Spacing.md,
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
    button: {
        marginTop: Spacing.md,
    },
    footer: {
        alignItems: 'center',
        marginTop: Spacing.lg,
    },
});
