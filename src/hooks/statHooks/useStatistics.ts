import { useQuery } from '@tanstack/react-query';
import { statisticsEndpoints } from '../../services/endpoints';

// Get expenses by category
export const useExpensesByCategory = () => {
    return useQuery({
        queryKey: ['statistics', 'by-category'],
        queryFn: async () => {
            const response = await statisticsEndpoints.getByCategory();
            return (response as any)?.data ?? [];
        },
    });
};

// Get monthly trends
export const useMonthlyTrends = () => {
    return useQuery({
        queryKey: ['statistics', 'monthly-trends'],
        queryFn: async () => {
            const response = await statisticsEndpoints.getMonthlyTrends();
            return (response as any)?.data ?? [];
        },
    });
};

// Get top categories
export const useTopCategories = (limit: number = 5) => {
    return useQuery({
        queryKey: ['statistics', 'top-categories', limit],
        queryFn: async () => {
            const response = await statisticsEndpoints.getTopCategories({ limit });
            return (response as any)?.data ?? [];
        },
    });
};

// Get summary statistics
export const useExpenseSummary = () => {
    return useQuery({
        queryKey: ['statistics', 'summary'],
        queryFn: async () => {
            const response = await statisticsEndpoints.getSummary();
            return (response as any)?.data;
        },
    });
};

// Combined hook for all statistics
export const useStatistics = () => {
    const byCategory = useExpensesByCategory();
    const monthlyTrends = useMonthlyTrends();
    const topCategories = useTopCategories();
    const summary = useExpenseSummary();

    return {
        byCategory: byCategory.data,
        monthlyTrends: monthlyTrends.data,
        topCategories: topCategories.data,
        summary: summary.data,
        isLoading:
            byCategory.isLoading ||
            monthlyTrends.isLoading ||
            topCategories.isLoading ||
            summary.isLoading,
        error:
            byCategory.error ||
            monthlyTrends.error ||
            topCategories.error ||
            summary.error,
    };
};