import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { formatCurrency } from '../../src/utils/currency';
import { formatDate } from '../../src/utils/date';
import { useCategories } from '../../src/hooks/categoryHooks/useCategories';
import { useTheme } from '../../src/hooks/themeHooks/useTheme';
import { Spacing, BorderRadius } from '../../src/theme/spacing';
import { Typography } from '../../src/theme/typography';
import { Category } from '@/types/expense.types';
import { EmptyState } from '@/components/ui/EmptyState';

export default function CategoryDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();
    const { categories, deleteCategory, isDeleting } = useCategories();

    const category = categories.find((c: Category) => c._id === id);

    const handleDelete = () => {
        Alert.alert('Delete Category', 'Are you sure you want to delete this category?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteCategory(id);
                        router.back();
                    } catch (error) {
                        console.error('Failed to delete category:', error);
                    }
                },
            },
        ]);
    };

    if (!category) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text }}>Category not found</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Card style={styles.previewCard}>
                    <Text style={[styles.categoryName, { color: colors.text }]}>
                        {category.name}
                    </Text>
                </Card>

                <Card style={styles.detailsCard}>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                            Created
                        </Text>
                        <Text style={[styles.detailValue, { color: colors.text }]}>
                            {new Date(category.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                </Card>

                {/* Related Expenses */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Related Expenses ({category.listOfExpenses?.length || 0})
                    </Text>

                    {category.listOfExpenses && category.listOfExpenses.length > 0 ? (
                        <View>
                            {category.listOfExpenses.map((expense: any) => {
                                const totalCategoryAmount = category.listOfExpenses?.reduce(
                                    (sum: number, e: any) => sum + (e.amount || 0),
                                    0
                                ) || 1;
                                const percentOfTotal = (expense.amount / totalCategoryAmount) * 100;

                                return (
                                    <TouchableOpacity
                                        key={expense._id}
                                        onPress={() => router.push(`/expense/${expense._id}`)}
                                    >
                                        <Card style={styles.expenseItem} padding="md">
                                            <View style={styles.expenseContent}>
                                                <View style={styles.expenseLeft}>
                                                    <Text style={[styles.expenseDescription, { color: colors.text }]}>
                                                        {expense.description}
                                                    </Text>
                                                    <Text style={[styles.expenseDate, { color: colors.textSecondary }]}>
                                                        {formatDate(expense.date, 'short')}
                                                    </Text>
                                                </View>
                                                <View style={styles.expenseRight}>
                                                    <Text style={[styles.expenseAmount, { color: colors.text }]}>
                                                        {formatCurrency(expense.amount)}
                                                    </Text>
                                                    <Text style={[styles.expensePercent, { color: colors.textSecondary }]}>
                                                        {percentOfTotal.toFixed(1)}%
                                                    </Text>
                                                </View>
                                            </View>
                                        </Card>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ) : (
                        <EmptyState title='No Expenses' description='No expenses in this category yet' />
                    )}
                </View>

                <View style={styles.spacer} />

                <View style={styles.actions}>
                    <Button
                        title="Edit"
                        onPress={() => {
                            Alert.alert('Edit', 'Edit functionality coming soon');
                        }}
                        variant="outline"
                        fullWidth
                        style={styles.actionButton}
                    />
                    <Button
                        title="Delete"
                        onPress={handleDelete}
                        variant="outline"
                        fullWidth
                        loading={isDeleting}
                        style={styles.actionButton}
                    />
                </View>
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
    previewCard: {
        alignItems: 'center',
        marginBottom: Spacing.md,
        paddingVertical: Spacing.xl,
    },
    categoryIcon: {
        width: 80,
        height: 80,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    categoryIconInner: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.full,
    },
    categoryName: {
        fontSize: Typography.fontSize['2xl'],
        fontWeight: Typography.fontWeight.bold,
    },
    detailsCard: {
        marginBottom: Spacing.md,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.md,
    },
    detailLabel: {
        fontSize: Typography.fontSize.md,
        fontWeight: Typography.fontWeight.medium,
    },
    detailValue: {
        fontSize: Typography.fontSize.md,
    },
    colorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    colorSwatch: {
        width: 24,
        height: 24,
        borderRadius: BorderRadius.sm,
    },
    divider: {
        height: 1,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.semibold,
        marginBottom: Spacing.md,
    },
    expenseItem: {
        marginBottom: Spacing.sm,
    },
    expenseContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    expenseLeft: {
        flex: 1,
        marginRight: Spacing.md,
    },
    expenseRight: {
        alignItems: 'flex-end',
    },
    expenseDescription: {
        fontSize: Typography.fontSize.md,
        fontWeight: Typography.fontWeight.medium,
        marginBottom: 4,
    },
    expenseDate: {
        fontSize: Typography.fontSize.xs,
    },
    expenseAmount: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.bold,
        marginBottom: 4,
    },
    expensePercent: {
        fontSize: Typography.fontSize.xs,
    },
    emptyText: {
        fontSize: Typography.fontSize.md,
        textAlign: 'center',
        paddingVertical: Spacing.lg,
    },
    spacer: {
        height: Spacing.lg,
    },
    actions: {
        gap: Spacing.sm,
    },
    actionButton: {
        marginBottom: Spacing.sm,
    },
});