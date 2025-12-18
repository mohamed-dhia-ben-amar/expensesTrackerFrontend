import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useCategories } from '../../src/hooks/categoryHooks/useCategories';
import { useTheme } from '../../src/hooks/themeHooks/useTheme';
import { Spacing, BorderRadius } from '../../src/theme/spacing';
import { Typography } from '../../src/theme/typography';
import { showApiErrorAlert } from '@/utils/apiError';

const categorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CreateCategoryScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { createCategory, isCreating } = useCategories();

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    const onSubmit = async (data: CategoryFormData) => {
        try {
            await createCategory(data);
            router.back();
        } catch (error) {
            showApiErrorAlert(error, { fallbackMessage: 'Failed to create category' });
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Category Name"
                            placeholder="e.g., Groceries, Entertainment"
                            value={value}
                            onChangeText={onChange}
                            error={errors.name?.message}
                            containerStyle={styles.input}
                        />
                    )}
                />
                
                <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Description"
                            placeholder="Brief description of the category"
                            value={value}
                            onChangeText={onChange}
                            error={errors.description?.message}
                            containerStyle={styles.input}
                        />
                    )}
                />

                <Button
                    title="Create Category"
                    onPress={handleSubmit(onSubmit)}
                    loading={isCreating}
                    fullWidth
                    size="lg"
                    style={styles.submitButton}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: Spacing.md,
    },
    input: {
        marginBottom: Spacing.lg,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    label: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.medium,
        marginBottom: Spacing.sm,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    colorOption: {
        width: 56,
        height: 56,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colorOptionSelected: {
        borderWidth: 3,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    checkmark: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: Typography.fontWeight.bold,
    },
    errorText: {
        fontSize: Typography.fontSize.xs,
        marginTop: Spacing.xs,
    },
    submitButton: {
        marginTop: Spacing.lg,
    },
});