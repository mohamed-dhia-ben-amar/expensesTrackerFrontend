import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryEndpoints } from '../../services/endpoints';
import { CreateCategoryDto, UpdateCategoryDto } from '../../types/expense.types';

export const useCategories = () => {
    const queryClient = useQueryClient();

    // Fetch categories
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await categoryEndpoints.getCategories();
            // Backend shape: { status, message, data: Category[] }
            return (response as any)?.data ?? [];
        },
    });

    // Create category
    const createMutation = useMutation({
        mutationFn: async (dto: CreateCategoryDto) => {
            const response = await categoryEndpoints.createCategory(dto);
            if ((response as any)?.status !== 'success') {
                throw new Error((response as any)?.message || 'Failed to create category');
            }
            return (response as any)?.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    // Update category
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateCategoryDto }) => {
            const response = await categoryEndpoints.updateCategory(id, data);
            if ((response as any)?.status !== 'success') {
                throw new Error((response as any)?.message || 'Failed to update category');
            }
            return (response as any)?.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    // Delete category
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await categoryEndpoints.deleteCategory(id);
            if ((response as any)?.status !== 'success') {
                throw new Error((response as any)?.message || 'Failed to delete category');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
        },
    });

    return {
        categories: data || [],
        isLoading,
        error,
        refetch,
        createCategory: createMutation.mutateAsync,
        updateCategory: updateMutation.mutateAsync,
        deleteCategory: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};