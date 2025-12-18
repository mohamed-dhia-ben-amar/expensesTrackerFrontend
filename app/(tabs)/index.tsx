import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../src/components/ui/Card';
import { formatCurrency } from '../../src/utils/currency';
import { SkeletonLoader } from '../../src/components/ui/SkeletonLoader';
import { useExpenses } from '../../src/hooks/expenseHooks/useExpenses';
import { useStatistics } from '../../src/hooks/statHooks/useStatistics';
import { useTheme } from '../../src/hooks/themeHooks/useTheme';
import { Spacing, BorderRadius } from '../../src/theme/spacing';
import { Typography } from '../../src/theme/typography';
import { EmptyState } from '@/components/ui/EmptyState';

export default function DashboardScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const {
        summary,
        byCategory,
        topCategories,
        monthlyTrends,
        isLoading: statsLoading,
    } = useStatistics();
    const {
        expenses,
        isLoading: expensesLoading,
        refetch: refetchExpenses,
    } = useExpenses();

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetchExpenses();
        setRefreshing(false);
    };

    const isLoading = statsLoading || expensesLoading;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        Dashboard
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                        Track your expenses
                    </Text>
                </View>

                {/* Summary Cards */}
                <View style={styles.summaryGrid}>
                    {/* Total Amount */}
                    <Card style={styles.summaryCard} padding="md">
                        {isLoading ? (
                            <>
                                <SkeletonLoader width={40} height={40} style={{ marginBottom: 12, borderRadius: BorderRadius.full }} />
                                <SkeletonLoader width={80} height={14} style={{ marginBottom: 8 }} />
                                <SkeletonLoader width={100} height={24} />
                            </>
                        ) : (
                            <>
                                <View style={[styles.summaryIconContainer, { backgroundColor: '#EEF2FF' }]}>
                                    <Text style={styles.summaryIcon}>💰</Text>
                                </View>
                                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                                    Total
                                </Text>
                                <Text style={[styles.summaryValue, { color: colors.text }]}>
                                    {formatCurrency(summary?.totalExpenses || 0)}
                                </Text>
                                <Text style={[styles.summarySubtext, { color: colors.textSecondary }]}>
                                    {summary?.expenseCount || 0} transactions
                                </Text>
                            </>
                        )}
                    </Card>

                    {/* Average Expense */}
                    <Card style={styles.summaryCard} padding="md">
                        {isLoading ? (
                            <>
                                <SkeletonLoader width={40} height={40} style={{ marginBottom: 12, borderRadius: BorderRadius.full }} />
                                <SkeletonLoader width={80} height={14} style={{ marginBottom: 8 }} />
                                <SkeletonLoader width={100} height={24} />
                            </>
                        ) : (
                            <>
                                <View style={[styles.summaryIconContainer, { backgroundColor: '#FEF3C7' }]}>
                                    <Text style={styles.summaryIcon}>📊</Text>
                                </View>
                                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                                    Average
                                </Text>
                                <Text style={[styles.summaryValue, { color: colors.text }]}>
                                    {formatCurrency(summary?.avgExpense || 0)}
                                </Text>
                                <Text style={[styles.summarySubtext, { color: colors.textSecondary }]}>
                                    per transaction
                                </Text>
                            </>
                        )}
                    </Card>
                </View>

                <View style={styles.summaryGrid}>
                    {/* Highest Expense */}
                    <Card style={styles.summaryCard} padding="md">
                        {isLoading ? (
                            <>
                                <SkeletonLoader width={40} height={40} style={{ marginBottom: 12, borderRadius: BorderRadius.full }} />
                                <SkeletonLoader width={80} height={14} style={{ marginBottom: 8 }} />
                                <SkeletonLoader width={100} height={24} />
                            </>
                        ) : (
                            <>
                                <View style={[styles.summaryIconContainer, { backgroundColor: '#FECACA' }]}>
                                    <Text style={styles.summaryIcon}>📈</Text>
                                </View>
                                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                                    Highest
                                </Text>
                                <Text style={[styles.summaryValue, { color: colors.text }]}>
                                    {formatCurrency(summary?.maxExpense || 0)}
                                </Text>
                                <Text style={[styles.summarySubtext, { color: colors.textSecondary }]}>
                                    max spend
                                </Text>
                            </>
                        )}
                    </Card>

                    {/* Lowest Expense */}
                    <Card style={styles.summaryCard} padding="md">
                        {isLoading ? (
                            <>
                                <SkeletonLoader width={40} height={40} style={{ marginBottom: 12, borderRadius: BorderRadius.full }} />
                                <SkeletonLoader width={80} height={14} style={{ marginBottom: 8 }} />
                                <SkeletonLoader width={100} height={24} />
                            </>
                        ) : (
                            <>
                                <View style={[styles.summaryIconContainer, { backgroundColor: '#D1FAE5' }]}>
                                    <Text style={styles.summaryIcon}>📉</Text>
                                </View>
                                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                                    Lowest
                                </Text>
                                <Text style={[styles.summaryValue, { color: colors.text }]}>
                                    {formatCurrency(summary?.minExpense || 0)}
                                </Text>
                                <Text style={[styles.summarySubtext, { color: colors.textSecondary }]}>
                                    min spend
                                </Text>
                            </>
                        )}
                    </Card>
                </View>


                {/* Expenses by Category */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Expenses by Category
                    </Text>

                    {isLoading ? (
                        <View>
                            {[1, 2, 3].map((i) => (
                                <Card key={i} style={styles.categoryListCard} padding="md">
                                    <SkeletonLoader width="40%" height={16} style={{ marginBottom: 8 }} />
                                    <SkeletonLoader width="80%" height={20} />
                                </Card>
                            ))}
                        </View>
                    ) : (
                        <View>
                            {byCategory?.length === 0 && (
                                <EmptyState
                                    title="No category expenses"
                                    description="Create expenses to see category breakdown"
                                />
                            )}
                            {byCategory?.map((item: any) => (
                                <Card key={item._id} style={styles.categoryListCard} padding="md">
                                    <View style={styles.categoryListContent}>
                                        <Text style={[styles.categoryListName, { color: colors.text }]}>
                                            {item.categoryName || 'Uncategorized'}
                                        </Text>
                                        <Text style={[styles.categoryListAmount, { color: colors.text }]}>
                                            {formatCurrency(item.totalAmount)}
                                        </Text>
                                    </View>
                                    <Text
                                        style={[
                                            styles.categoryListCount,
                                            { color: colors.textSecondary },
                                        ]}
                                    >
                                        {item.count} transactions
                                    </Text>
                                </Card>
                            ))}
                        </View>
                    )}
                </View>

                {/* Top Categories */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Top Categories
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
                            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <View style={styles.categoryGrid}>
                            {[1, 2, 3].map((i) => (
                                <Card key={i} style={styles.categoryCard} padding="md">
                                    <SkeletonLoader width={40} height={40} style={{ marginBottom: 8 }} />
                                    <SkeletonLoader width={60} height={14} style={{ marginBottom: 4 }} />
                                    <SkeletonLoader width={80} height={20} />
                                </Card>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.categoryGrid}>
                            {topCategories?.length === 0 && (
                                <EmptyState
                                    title="No top categories"
                                    description="Start tracking expenses to see top categories"
                                />
                            )}
                            {topCategories?.slice(0, 3).map((cat: any) => (
                                <Card key={cat._id} style={styles.categoryCard} padding="md">
                                    <View
                                        style={[
                                            styles.categoryIcon,
                                            { backgroundColor: '#4F46E5' + '20' },
                                        ]}
                                    >
                                        <View
                                            style={[styles.categoryDot, { backgroundColor: '#4F46E5' }]}
                                        />
                                    </View>
                                    <Text
                                        style={[styles.categoryName, { color: colors.text }]}
                                        numberOfLines={1}
                                    >
                                        {cat.categoryName || 'Uncategorized'}
                                    </Text>
                                    <Text style={[styles.categoryAmount, { color: colors.text }]}>
                                        {formatCurrency(cat.totalAmount)}
                                    </Text>
                                    <Text style={[styles.categoryPercentage, { color: colors.textSecondary }]}>
                                        {cat.count} items
                                    </Text>
                                </Card>
                            ))}
                        </View>
                    )}
                </View>

                {/* Monthly Trends */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Monthly Trends
                    </Text>

                    {isLoading ? (
                        <View>
                            {[1, 2, 3].map((i) => (
                                <Card key={i} style={styles.trendCard} padding="md">
                                    <SkeletonLoader width="30%" height={16} style={{ marginBottom: 8 }} />
                                    <SkeletonLoader width="60%" height={20} />
                                </Card>
                            ))}
                        </View>
                    ) : (
                        <View>
                            {monthlyTrends && monthlyTrends?.length === 0 && (
                                <EmptyState
                                    title="No monthly data"
                                    description="Expenses will appear here as you track them"
                                />
                            )}
                            {monthlyTrends?.map((trend: any, idx: number) => {
                                const year = trend?._id?.year ?? trend?.year;
                                const month = trend?._id?.month ?? trend?.month;
                                if (year == null || month == null) return null;

                                const label = new Date(year, month - 1).toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric',
                                });

                                return (
                                    <Card
                                        key={`${year}-${month}-${idx}`}
                                        style={styles.trendCard}
                                        padding="md"
                                    >
                                        <View style={styles.trendContent}>
                                            <Text style={[styles.trendMonth, { color: colors.text }]}>
                                                {label}
                                            </Text>
                                            <Text style={[styles.trendAmount, { color: colors.text }]}>
                                                {formatCurrency(trend.totalAmount)}
                                            </Text>
                                        </View>
                                        <Text style={[styles.trendCount, { color: colors.textSecondary }]}>
                                            {trend.count} transactions
                                        </Text>
                                    </Card>
                                );
                            })}
                        </View>
                    )}
                </View>

                {/* Recent Expenses */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Recent Expenses
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/expenses')}>
                            <Text style={[styles.seeAll, { color: colors.primary }]}>
                                See All
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <View>
                            {[1, 2, 3].map((i) => (
                                <Card key={i} style={styles.expenseCard} padding="md">
                                    <SkeletonLoader width="100%" height={20} style={{ marginBottom: 8 }} />
                                    <SkeletonLoader width="60%" height={16} />
                                </Card>
                            ))}
                        </View>
                    ) : (
                        <View>
                            {expenses.length === 0 && (
                                <EmptyState
                                    title="No expenses yet"
                                    description="Start tracking your expenses by tapping the + button"
                                />
                            )}
                            {expenses.slice(0, 5).map((expense: any) => (
                                <TouchableOpacity
                                    key={expense._id}
                                    onPress={() => router.push(`/expense/${expense._id}`)}
                                >
                                    <Card style={styles.expenseCard} padding="md">
                                        <View style={styles.expenseContent}>
                                            <View
                                                style={[
                                                    styles.expenseIndicator,
                                                    { backgroundColor: colors.primary },
                                                ]}
                                            />
                                            <View style={styles.expenseDetails}>
                                                <Text
                                                    style={[
                                                        styles.expenseDescription,
                                                        { color: colors.text },
                                                    ]}
                                                >
                                                    {expense.description}
                                                </Text>
                                                <Text
                                                    style={[
                                                        styles.expenseCategory,
                                                        { color: colors.textSecondary },
                                                    ]}
                                                >
                                                    {expense.category?.name || 'Uncategorized'}
                                                </Text>
                                            </View>
                                            <Text
                                                style={[
                                                    styles.expenseAmount,
                                                    { color: colors.text },
                                                ]}
                                            >
                                                {formatCurrency(expense.amount)}
                                            </Text>
                                        </View>
                                    </Card>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

            </ScrollView>
            {/* FAB */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/expense/create')}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, position: 'relative' },
    scrollContent: {
        padding: Spacing.md,
        paddingBottom: 100,
    },
    header: { marginBottom: Spacing.lg },
    headerTitle: {
        fontSize: Typography.fontSize['3xl'],
        fontWeight: Typography.fontWeight.bold,
    },
    headerSubtitle: {
        fontSize: Typography.fontSize.md,
    },
    summaryGrid: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.md,
    },
    summaryCard: { 
        flex: 1,
        minHeight: 140,
    },
    summaryIconContainer: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    summaryIcon: {
        fontSize: 24,
    },
    summaryLabel: { 
        fontSize: Typography.fontSize.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: Typography.fontSize.xl,
        fontWeight: Typography.fontWeight.bold,
        marginBottom: 2,
    },
    summarySubtext: {
        fontSize: Typography.fontSize.xs,
    },
    changeText: {
        fontSize: Typography.fontSize.xs,
        marginTop: 4,
    },
    section: { marginBottom: Spacing.xl },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontSize: Typography.fontSize.xl,
        fontWeight: Typography.fontWeight.semibold,
    },
    seeAll: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.medium,
    },
    categoryListCard: { marginBottom: Spacing.sm },
    categoryListContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    categoryListName: {
        fontSize: Typography.fontSize.md,
        fontWeight: Typography.fontWeight.medium,
    },
    categoryListAmount: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.bold,
    },
    categoryListCount: {
        fontSize: Typography.fontSize.sm,
    },
    categoryGrid: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    categoryCard: {
        flex: 1,
        alignItems: 'center',
    },
    categoryIcon: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    categoryDot: {
        width: 20,
        height: 20,
        borderRadius: BorderRadius.full,
    },
    categoryName: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.medium,
        marginBottom: 4,
    },
    categoryAmount: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.bold,
    },
    categoryPercentage: {
        fontSize: Typography.fontSize.xs,
        marginTop: 2,
    },
    trendCard: {
        marginBottom: Spacing.sm,
    },
    trendContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    trendMonth: {
        fontSize: Typography.fontSize.md,
        fontWeight: Typography.fontWeight.medium,
    },
    trendAmount: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.bold,
    },
    trendCount: {
        fontSize: Typography.fontSize.sm,
    },
    expenseCard: {
        marginBottom: Spacing.sm,
    },
    expenseContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expenseIndicator: {
        width: 4,
        height: 40,
        borderRadius: 2,
        marginRight: Spacing.md,
    },
    expenseDetails: { flex: 1 },
    expenseDescription: {
        fontSize: Typography.fontSize.md,
        fontWeight: Typography.fontWeight.medium,
    },
    expenseCategory: {
        fontSize: Typography.fontSize.sm,
    },
    expenseAmount: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.semibold,
    },
    fab: {
        position: 'absolute',
        right: Spacing.md,
        bottom: Spacing.md,
        width: 56,
        height: 56,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        zIndex: 10,
    },
    fabText: {
        fontSize: 28,
        color: '#FFF',
        fontWeight: Typography.fontWeight.bold,
    },
});