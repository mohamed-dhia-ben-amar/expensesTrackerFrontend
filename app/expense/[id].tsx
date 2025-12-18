import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { LoadingScreen } from '../../src/components/ui/LoadingScreen';
import { formatCurrency } from '../../src/utils/currency';
import { formatDate } from '../../src/utils/date';
import { useExpense, useExpenses } from '../../src/hooks/expenseHooks/useExpenses';
import { useTheme } from '../../src/hooks/themeHooks/useTheme';
import { Spacing, BorderRadius } from '../../src/theme/spacing';
import { Typography } from '../../src/theme/typography';

export default function ExpenseDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();
    const { data: expense, isLoading } = useExpense(id);
    const { deleteExpense, isDeleting } = useExpenses();

    const handleDelete = () => {
        Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteExpense(id);
                        router.back();
                    } catch (error) {
                        console.error('Failed to delete expense:', error);
                    }
                },
            },
        ]);
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!expense) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text }}>Expense not found</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Card style={styles.amountCard}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Amount</Text>
                    <Text style={[styles.amount, { color: colors.text }]}>
                        {formatCurrency(expense.amount)}
                    </Text>
                </Card>

                <Card style={styles.detailsCard}>
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                            Description
                        </Text>
                        <Text style={[styles.detailValue, { color: colors.text }]}>
                            {expense.description}
                        </Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                            Category
                        </Text>
                        <Text style={[styles.detailValue, { color: colors.text }]}>
                            {expense.category?.name || 'Uncategorized'}
                        </Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Date</Text>
                        <Text style={[styles.detailValue, { color: colors.text }]}>
                            {formatDate(expense.date, 'long')}
                        </Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                            Created
                        </Text>
                        <Text style={[styles.detailValue, { color: colors.text }]}>
                            {formatDate(expense.createdAt, 'relative')}
                        </Text>
                    </View>
                </Card>

                <View style={styles.actions}>
                    <Button
                        title="Edit"
                        onPress={() => {
                            // Navigate to edit screen (would need to be implemented)
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
    amountCard: {
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    label: {
        fontSize: Typography.fontSize.sm,
        marginBottom: Spacing.xs,
    },
    amount: {
        fontSize: Typography.fontSize['4xl'],
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
        textAlign: 'right',
        flex: 1,
        marginLeft: Spacing.md,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    categoryDot: {
        width: 10,
        height: 10,
        borderRadius: BorderRadius.full,
    },
    divider: {
        height: 1,
    },
    actions: {
        gap: Spacing.sm,
    },
    actionButton: {
        marginBottom: Spacing.sm,
    },
});