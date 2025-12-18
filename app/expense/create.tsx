import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ExpenseForm } from '../../src/components/expense/ExpenseForm';
import { useExpenses } from '../../src/hooks/expenseHooks/useExpenses';
import { useTheme } from '../../src/hooks/themeHooks/useTheme';
import { CreateExpenseDto } from '../../src/types/expense.types';
import { showApiErrorAlert } from '@/utils/apiError';

export default function CreateExpenseScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { createExpense, isCreating } = useExpenses();

    const handleSubmit = async (data: CreateExpenseDto) => {
        try {
            await createExpense(data);
            router.back();
        } catch (error) {
            showApiErrorAlert(error, { fallbackMessage: 'Failed to create expense' });
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ExpenseForm onSubmit={handleSubmit} isLoading={isCreating} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});