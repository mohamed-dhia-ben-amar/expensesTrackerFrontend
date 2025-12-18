import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
    Modal,
    TouchableOpacity,
} from 'react-native';
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
import { useFocusEffect } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';

const registerSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    placeOfBirth: z.string().min(2, 'Place of birth is required'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { register, isRegistering } = useAuth();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            dateOfBirth: '1990-01-01',
            placeOfBirth: 'Tunisia',
        },
    });

    const [showDOBPicker, setShowDOBPicker] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(new Date());
    const [countryCode, setCountryCode] = useState<CountryCode>('TN');

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await register(data);
            router.push({
                pathname: '/(auth)/verify-email',
                params: { email: data.email }
            });
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    // Block Android hardware back on register to avoid navigating back to login
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
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Logo / Illustration */}
                    <Image
                        source={require('../../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Start tracking your expenses today
                        </Text>
                    </View>

                    {/* Form Card */}
                    <View style={[styles.formCard, { backgroundColor: colors.card || colors.background }]}>
                        <Controller
                            control={control}
                            name="firstName"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="First Name"
                                    placeholder="John"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.firstName?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="lastName"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Last Name"
                                    placeholder="Doe"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.lastName?.message}
                                />
                            )}
                        />

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

                        {/* Date of Birth - Native Picker */}
                        <Controller
                            control={control}
                            name="dateOfBirth"
                            render={({ field: { onChange, value } }) => (
                                <View>
                                    <Text style={[styles.inputLabel, { color: colors.text }]}>Date of Birth</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setTempDate(value ? new Date(value) : new Date());
                                            setShowDOBPicker(true);
                                        }}
                                        style={[styles.selectField, { borderColor: colors.border }]}
                                    >
                                        <Text style={{ color: colors.text }}>
                                            {value ? value : 'YYYY-MM-DD'}
                                        </Text>
                                    </TouchableOpacity>
                                    {errors.dateOfBirth?.message ? (
                                        <Text style={[styles.errorText]}>{errors.dateOfBirth.message}</Text>
                                    ) : null}

                                    {/* Date Picker Modal */}
                                    <Modal
                                        visible={showDOBPicker}
                                        transparent
                                        animationType="fade"
                                        onRequestClose={() => setShowDOBPicker(false)}
                                    >
                                        <View style={styles.modalOverlay}>
                                            <View style={[styles.modalContent, { backgroundColor: colors.card || colors.background }]}>
                                                <Text style={[styles.modalTitle, { color: colors.text }]}>Select Date of Birth</Text>
                                                
                                                <DateTimePicker
                                                    value={tempDate}
                                                    mode="date"
                                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                    onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                                                        if (selectedDate) {
                                                            setTempDate(selectedDate);
                                                        }
                                                    }}
                                                    style={styles.datePicker}
                                                />

                                                <View style={styles.modalButtons}>
                                                    <Button
                                                        title="Cancel"
                                                        onPress={() => setShowDOBPicker(false)}
                                                        variant="outline"
                                                        style={styles.modalButton}
                                                    />
                                                    <Button
                                                        title="Confirm"
                                                        onPress={() => {
                                                            const yyyy = tempDate.getFullYear();
                                                            const mm = String(tempDate.getMonth() + 1).padStart(2, '0');
                                                            const dd = String(tempDate.getDate()).padStart(2, '0');
                                                            onChange(`${yyyy}-${mm}-${dd}`);
                                                            setShowDOBPicker(false);
                                                        }}
                                                        style={styles.modalButton}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </Modal>
                                </View>
                            )}
                        />

                        {/* Place of Birth - Country Picker */}
                        <Controller
                            control={control}
                            name="placeOfBirth"
                            render={({ field: { onChange, value } }) => (
                                <View>
                                    <Text style={[styles.inputLabel, { color: colors.text }]}>Place of Birth</Text>
                                    <TouchableOpacity 
                                        style={[styles.countryPickerField, { borderColor: colors.border }]}
                                        onPress={() => {}}
                                    >
                                        <CountryPicker
                                            withFilter
                                            withFlag
                                            withAlphaFilter
                                            onSelect={(country: Country) => {
                                                setCountryCode(country.cca2 as CountryCode);
                                                const countryName = typeof country.name === 'string' ? country.name : (country.name as any).common;
                                                onChange(countryName);
                                            }}
                                            countryCode={countryCode}
                                            excludeCountries={['IL']}
                                        />
                                        <Text style={[styles.countryValue, { color: value ? colors.text : colors.textSecondary }]}>
                                            {value || 'Select country'}
                                        </Text>
                                    </TouchableOpacity>
                                    {errors.placeOfBirth?.message ? (
                                        <Text style={styles.errorText}>{errors.placeOfBirth.message}</Text>
                                    ) : null}
                                </View>
                            )}
                        />

                        <Button
                            title="Sign Up"
                            onPress={handleSubmit(onSubmit)}
                            loading={isRegistering}
                            fullWidth
                            size="lg"
                            style={styles.button}
                        />

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={[styles.footerText, { color: colors.textSecondary }]}>Already have an account? </Text>
                            <Button
                                title="Sign In"
                                onPress={() => router.replace('/(auth)/login')}
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
    inputLabel: {
        fontSize: Typography.fontSize.md,
        fontWeight: Typography.fontWeight.medium,
        marginBottom: 6,
    },
    selectField: {
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 12,
    },
    countryPickerField: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 14,
        gap: 12,
    },
    countryValue: {
        flex: 1,
        fontSize: Typography.fontSize.md,
    },
    errorText: {
        marginTop: 6,
        color: '#ef4444',
        fontSize: Typography.fontSize.sm,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        borderRadius: 24,
        padding: Spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 20,
    },
    modalTitle: {
        fontSize: Typography.fontSize.xl,
        fontWeight: Typography.fontWeight.bold,
        marginBottom: Spacing.lg,
        textAlign: 'center',
    },
    datePicker: {
        width: '100%',
        marginBottom: Spacing.md,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginTop: Spacing.lg,
    },
    modalButton: {
        flex: 1,
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