import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/themeHooks/useTheme';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';
import { Expense } from '../../types/expense.types';
import { formatCurrency } from '../../utils/currency';

interface ExpenseListItemProps {
    expense: Expense;
    onPress: () => void;
}

export const ExpenseListItem: React.FC<ExpenseListItemProps> = ({ expense, onPress }) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.card }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View
                style={[
                    styles.categoryIndicator,
                    { backgroundColor: colors.primary },
                ]}
            />
            <View style={styles.content}>
                <View style={styles.leftContent}>
                    <Text style={[styles.description, { color: colors.text }]} numberOfLines={1}>
                        {expense.description}
                    </Text>
                    <Text style={[styles.category, { color: colors.textSecondary }]}>
                        {typeof expense.category === 'string'
                            ? 'Uncategorized'
                            : expense.category?.name || 'Uncategorized'}
                    </Text>
                </View>
                <Text style={[styles.amount, { color: colors.text }]}>
                    {formatCurrency(expense.amount)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    categoryIndicator: {
        width: 4,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
    },
    leftContent: {
        flex: 1,
        marginRight: Spacing.md,
    },
    description: {
        fontSize: Typography.fontSize.md,
        fontWeight: Typography.fontWeight.medium,
        marginBottom: 4,
    },
    category: {
        fontSize: Typography.fontSize.sm,
    },
    amount: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.semibold,
    },
});