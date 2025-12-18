import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RefreshControl } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { Card } from '../../src/components/ui/Card';
import { formatCurrency } from '../../src/utils/currency';
import { SkeletonLoader } from '../../src/components/ui/SkeletonLoader';
import { useStatistics } from '../../src/hooks/statHooks/useStatistics';
import { useTheme } from '../../src/hooks/themeHooks/useTheme';
import { Spacing, BorderRadius } from '../../src/theme/spacing';
import { Typography } from '../../src/theme/typography';

export default function StatisticsScreen() {
    const { colors } = useTheme();
    const { summary, byCategory, monthlyTrends, isLoading } = useStatistics();
    const queryClient = useQueryClient();
    const [refreshing, setRefreshing] = React.useState(false);

    const palette = ['#4F46E5', '#0EA5E9', '#F59E0B', '#EC4899', '#22C55E'];
    const trends = monthlyTrends || [];
    const trendMax = trends.length
        ? Math.max(...trends.map((t: any) => t.totalAmount || 0), 1)
        : 1;
    const totalCategoryAmount =
        byCategory?.reduce(
            (sum: number, cat: any) => sum + (cat?.totalAmount || 0),
            0
        ) || 0;

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await queryClient.invalidateQueries({ queryKey: ['statistics'] });
        setRefreshing(false);
    }, [queryClient]);
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                        title="Pull to refresh"
                        titleColor={colors.textSecondary}
                    />
                }
            >

                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        Statistics
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                        Your spending insights
                    </Text>
                </View>

                {/* Overview */}
                <Card style={styles.overviewCard}>
                    {isLoading ? (
                        <>
                            <SkeletonLoader width={120} height={20} style={{ marginBottom: 8 }} />
                            <SkeletonLoader width="100%" height={60} />
                        </>
                    ) : (
                        <>
                            <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>
                                Total Spending
                            </Text>

                            <Text style={[styles.overviewValue, { color: colors.text }]}>
                                {formatCurrency(summary?.totalExpenses || 0)}
                            </Text>

                            <View style={styles.overviewRow}>
                                <View style={styles.overviewItem}>
                                    <Text
                                        style={[
                                            styles.overviewItemLabel,
                                            { color: colors.textSecondary },
                                        ]}
                                    >
                                        This Month
                                    </Text>
                                    <Text
                                        style={[
                                            styles.overviewItemValue,
                                            { color: colors.text },
                                        ]}
                                    >
                                        {formatCurrency(summary?.totalExpenses || 0)}
                                    </Text>
                                </View>

                                <View style={styles.overviewItem}>
                                    <Text
                                        style={[
                                            styles.overviewItemLabel,
                                            { color: colors.textSecondary },
                                        ]}
                                    >
                                        Average
                                    </Text>
                                    <Text
                                        style={[
                                            styles.overviewItemValue,
                                            { color: colors.text },
                                        ]}
                                    >
                                        {formatCurrency(summary?.avgExpense || 0)}
                                    </Text>
                                </View>
                            </View>
                        </>
                    )}
                </Card>

                {/* By Category */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        By Category
                    </Text>

                    {isLoading ? (
                        [1, 2, 3].map((i) => (
                            <Card key={i} style={styles.categoryCard} padding="md">
                                <SkeletonLoader width="100%" height={20} style={{ marginBottom: 8 }} />
                                <SkeletonLoader width="80%" height={16} />
                            </Card>
                        ))
                    ) : byCategory?.length ? (
                        byCategory.map((category: any, idx: number) => {
                            const accent = palette[idx % palette.length];

                            const percent = totalCategoryAmount
                                ? ((category.totalAmount || 0) / totalCategoryAmount) * 100
                                : 0;

                            return (
                                <Card key={category._id} style={styles.categoryCard} padding="md">
                                    <View style={styles.categoryHeader}>
                                        <View style={styles.categoryInfo}>
                                            <View
                                                style={[
                                                    styles.categoryColorDot,
                                                    { backgroundColor: accent },
                                                ]}
                                            />
                                            <Text
                                                style={[
                                                    styles.categoryName,
                                                    { color: colors.text },
                                                ]}
                                            >
                                                {category.categoryName}
                                            </Text>
                                        </View>

                                        <Text
                                            style={[
                                                styles.categoryAmount,
                                                { color: colors.text },
                                            ]}
                                        >
                                            {formatCurrency(category.totalAmount)}
                                        </Text>
                                    </View>

                                    <View
                                        style={[
                                            styles.progressBar,
                                            { backgroundColor: colors.border },
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.progressFill,
                                                {
                                                    width: `${percent}%`,
                                                    backgroundColor: accent,
                                                },
                                            ]}
                                        />
                                    </View>

                                    <View style={styles.categoryFooter}>
                                        <Text
                                            style={[
                                                styles.categoryCount,
                                                { color: colors.textSecondary },
                                            ]}
                                        >
                                            {category.count} transactions
                                        </Text>
                                        <Text
                                            style={[
                                                styles.categoryPercentage,
                                                { color: colors.textSecondary },
                                            ]}
                                        >
                                            {percent.toFixed(1)}%
                                        </Text>
                                    </View>
                                </Card>
                            );
                        })
                    ) : (
                        <Text style={{ color: colors.textSecondary }}>No category data</Text>
                    )}
                </View>

                {/* Monthly Trends */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Monthly Trends
                    </Text>

                    {isLoading ? (
                        <Card padding="md">
                            <SkeletonLoader width="100%" height={200} />
                        </Card>
                    ) : (
                        <Card padding="md">
                            <View style={styles.trendSummaryRow}>
                                <View style={[styles.trendPill, { backgroundColor: colors.card }]}>
                                    <Text style={[styles.trendPillLabel, { color: colors.textSecondary }]}>Total</Text>
                                    <Text style={[styles.trendPillValue, { color: colors.text }]}>
                                        {formatCurrency(summary?.totalExpenses || 0)}
                                    </Text>
                                </View>
                                <View style={[styles.trendPill, { backgroundColor: colors.card }]}>
                                    <Text style={[styles.trendPillLabel, { color: colors.textSecondary }]}>Avg</Text>
                                    <Text style={[styles.trendPillValue, { color: colors.text }]}>
                                        {formatCurrency(summary?.avgExpense || 0)}
                                    </Text>
                                </View>
                                <View style={[styles.trendPill, { backgroundColor: colors.card }]}>
                                    <Text style={[styles.trendPillLabel, { color: colors.textSecondary }]}>Count</Text>
                                    <Text style={[styles.trendPillValue, { color: colors.text }]}>
                                        {summary?.expenseCount || 0}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.chart}>
                                {trends.length ? (
                                    trends.map((trend: any, idx: number) => {
                                        const height = ((trend.totalAmount || 0) / trendMax) * 150;
                                        const year = trend?._id?.year ?? trend?.year;
                                        const month = trend?._id?.month ?? trend?.month;
                                        const label = year && month
                                            ? new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short' })
                                            : '';

                                        return (
                                            <View key={idx} style={styles.chartBar}>
                                                <Text style={[styles.chartValue, { color: colors.text }]}>
                                                    {formatCurrency(trend.totalAmount || 0)}
                                                </Text>
                                                <View
                                                    style={[
                                                        styles.chartBarFill,
                                                        {
                                                            height,
                                                            backgroundColor: colors.primary,
                                                        },
                                                    ]}
                                                />
                                                <Text
                                                    style={[styles.chartBarLabel, { color: colors.textSecondary }]}
                                                >
                                                    {label}
                                                </Text>
                                            </View>
                                        );
                                    })
                                ) : (
                                    <Text style={{ color: colors.textSecondary }}>No monthly data</Text>
                                )}
                            </View>
                        </Card>
                    )}
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: Spacing.md },

    header: { marginBottom: Spacing.lg },
    headerTitle: {
        fontSize: Typography.fontSize['3xl'],
        fontWeight: Typography.fontWeight.bold,
    },
    headerSubtitle: { fontSize: Typography.fontSize.md },

    overviewCard: { marginBottom: Spacing.xl },
    overviewLabel: { fontSize: Typography.fontSize.sm },
    overviewValue: {
        fontSize: Typography.fontSize['4xl'],
        fontWeight: Typography.fontWeight.bold,
        marginBottom: Spacing.md,
    },
    overviewRow: { flexDirection: 'row', gap: Spacing.lg },
    overviewItem: { flex: 1 },
    overviewItemLabel: { fontSize: Typography.fontSize.xs },
    overviewItemValue: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.semibold,
    },

    section: { marginBottom: Spacing.xl },
    sectionTitle: {
        fontSize: Typography.fontSize.xl,
        fontWeight: Typography.fontWeight.semibold,
        marginBottom: Spacing.md,
    },

    categoryCard: { marginBottom: Spacing.sm },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    trendSummaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
        gap: Spacing.sm,
    },
    trendPill: {
        flex: 1,
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
    },
    trendPillLabel: {
        fontSize: Typography.fontSize.xs,
        marginBottom: 4,
    },
    trendPillValue: {
        fontSize: Typography.fontSize.md,
        fontWeight: Typography.fontWeight.semibold,
    },
    categoryColorDot: {
        width: 12,
        height: 12,
        borderRadius: BorderRadius.full,
    },
    categoryName: {
        fontSize: Typography.fontSize.md,
        fontWeight: Typography.fontWeight.medium,
    },
    categoryAmount: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.semibold,
    },

    progressBar: {
        height: 6,
        borderRadius: BorderRadius.sm,
        overflow: 'hidden',
        marginVertical: Spacing.sm,
    },
    progressFill: { height: '100%' },

    categoryFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    categoryCount: { fontSize: Typography.fontSize.xs },
    categoryPercentage: {
        fontSize: Typography.fontSize.xs,
        fontWeight: Typography.fontWeight.medium,
    },

    chart: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 180,
    },
    chartBar: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    chartBarFill: {
        width: '70%',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    chartBarLabel: {
        fontSize: Typography.fontSize.xs,
        marginTop: 4,
    },
    chartValue: {
        fontSize: Typography.fontSize.xs,
        marginBottom: Spacing.xs,
    },
});
