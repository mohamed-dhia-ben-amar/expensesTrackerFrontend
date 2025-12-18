import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseEndpoints } from '../../services/endpoints';
import { CreateExpenseDto, UpdateExpenseDto, Expense } from '../../types/expense.types';

export const useExpenses = () => {
    const queryClient = useQueryClient();

    // Fetch expenses
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['expenses'],
        queryFn: async () => {
            const response = await expenseEndpoints.getExpenses();
            // Backend shape: { status, message, data: Expense[] }
            return (response as any)?.data ?? [];
        },
    });

    // Create expense
    const createMutation = useMutation({
        mutationFn: async (dto: CreateExpenseDto) => {
            const response = await expenseEndpoints.createExpense(dto);
            if ((response as any)?.status !== 'success') {
                throw new Error((response as any)?.message || 'Failed to create expense');
            }
            return (response as any)?.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['statistics'] });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    // Update expense
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateExpenseDto }) => {
            const response = await expenseEndpoints.updateExpense(id, data);
            if ((response as any)?.status !== 'success') {
                throw new Error((response as any)?.message || 'Failed to update expense');
            }
            return (response as any)?.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['statistics'] });
        },
    });

    // Delete expense
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await expenseEndpoints.deleteExpense(id);
            if ((response as any)?.status !== 'success') {
                throw new Error((response as any)?.message || 'Failed to delete expense');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['statistics'] });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    return {
        expenses: data || [],
        isLoading,
        error,
        refetch,
        createExpense: createMutation.mutateAsync,
        updateExpense: updateMutation.mutateAsync,
        deleteExpense: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};

export const useExpense = (id: string) => {
    return useQuery({
        queryKey: ['expense', id],
        queryFn: async () => {
            const response = await expenseEndpoints.getExpense(id);
            return (response as any)?.data;
        },
        enabled: !!id,
    });
};