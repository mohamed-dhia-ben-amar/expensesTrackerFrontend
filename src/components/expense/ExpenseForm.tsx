import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useCategories } from '../../hooks/categoryHooks/useCategories';
import { useTheme } from '../../hooks/themeHooks/useTheme';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { Typography } from '../../theme/typography';
import { Category, CreateExpenseDto } from '../../types/expense.types';

const expenseSchema = z.object({
    amount: z
        .string()
        .min(1, 'Amount is required')
        .refine((val) => !Number.isNaN(parseFloat(val)), 'Amount must be a number'),
    description: z.string().min(1, 'Description is required'),
    categoryId: z.string().min(1, 'Category is required'),
    date: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
    onSubmit: (data: CreateExpenseDto) => Promise<void>;
    initialData?: Partial<CreateExpenseDto>;
    isLoading?: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
    onSubmit,
    initialData,
    isLoading,
}) => {
    const { colors } = useTheme();
    const { categories } = useCategories();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ExpenseFormData>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            amount: initialData?.amount?.toString() || '',
            description: initialData?.description || '',
            categoryId:
                (initialData as any)?.category?._id || (initialData as any)?.category || '',
            date: initialData?.date || new Date().toISOString(),
        },
    });

    const onFormSubmit = async (data: ExpenseFormData) => {
        await onSubmit({
            amount: parseFloat(data.amount),
            description: data.description,
            category: data.categoryId,
            date: data.date || new Date().toISOString(),
        });
    };

    const accentPalette = ['#4F46E5', '#0EA5E9', '#F59E0B', '#EC4899', '#22C55E'];

    return (
        <ScrollView style={styles.container}>
            <Controller
                control={control}
                name="amount"
                render={({ field: { onChange, value } }) => (
                    <Input
                        label="Amount"
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        value={value}
                        onChangeText={onChange}
                        error={errors.amount?.message}
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
                        placeholder="What did you spend on?"
                        value={value}
                        onChangeText={onChange}
                        error={errors.description?.message}
                        containerStyle={styles.input}
                    />
                )}
            />

            <Controller
                control={control}
                name="categoryId"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.input}>
                        <Text
                            style={[
                                styles.label,
                                { color: colors.text },
                                errors.categoryId && { color: colors.error },
                            ]}
                        >
                            Category
                        </Text>
                        <View style={styles.categoryGrid}>
                            {categories.map((category: Category, idx: number) => {
                                const selected = value === category._id;
                                const accent = accentPalette[idx % accentPalette.length];

                                return (
                                    <TouchableOpacity
                                        key={category._id}
                                        style={[
                                            styles.categoryChip,
                                            {
                                                backgroundColor: selected ? accent : colors.surface,
                                                borderColor: selected ? accent : colors.border ?? '#E5E7EB',
                                            },
                                        ]}
                                        onPress={() => onChange(category._id)}
                                    >
                                        <Text
                                            style={[
                                                styles.categoryChipText,
                                                {
                                                    color: selected ? '#FFFFFF' : colors.text,
                                                },
                                            ]}
                                        >
                                            {category.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        {errors.categoryId && (
                            <Text style={[styles.errorText, { color: colors.error }]}> 
                                {errors.categoryId.message}
                            </Text>
                        )}
                    </View>
                )}
            />

            <Button
                title="Save Expense"
                onPress={handleSubmit(onFormSubmit)}
                loading={isLoading}
                fullWidth
                style={styles.submitButton}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.md,
    },
    input: {
        marginBottom: Spacing.lg,
    },
    label: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.medium,
        marginBottom: Spacing.xs,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    categoryChip: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
    },
    categoryChipText: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.medium,
    },
    errorText: {
        fontSize: Typography.fontSize.xs,
        marginTop: Spacing.xs,
    },
    submitButton: {
        marginTop: Spacing.md,
    },
});