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
import { useStatistics } from '@/hooks/statHooks/useStatistics';
import { useTheme } from '@/hooks/themeHooks/useTheme';
import { Spacing, BorderRadius } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { useCategories } from '@/hooks/categoryHooks/useCategories';
import { EmptyState } from '@/components/ui/EmptyState';
import { Category } from '@/types/expense.types';

export default function DashboardScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { categories, isLoading: categoriesLoading, refetch: refetchCategories } = useCategories();
    const { summary } = useStatistics();

    const [refreshing, setRefreshing] = React.useState(false);

    const accentColors = ['#4F46E5', '#0EA5E9', '#F59E0B', '#EC4899', '#22C55E'];

    const onRefresh = async () => {
        setRefreshing(true);
        await refetchCategories();
        setRefreshing(false);
    };

    const isLoading = categoriesLoading;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Greeting Header */}
                <View style={styles.greetingSection}>
                    <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                        Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
                    </Text>
                    <Text style={[styles.greetingName, { color: colors.text }]}>
                        Welcome back
                    </Text>
                </View>

                {/* All Categories */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            All Categories
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/category/create')}>
                            <Text style={[styles.seeAll, { color: colors.primary }]}>Create Category</Text>
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <View style={styles.categoryList}>
                            {[1, 2, 3].map((i) => (
                                <Card key={i} style={styles.categoryItem} padding="md">
                                    <SkeletonLoader width={40} height={40} style={{ marginRight: 12 }} />
                                    <View style={{ flex: 1 }}>
                                        <SkeletonLoader width={100} height={16} style={{ marginBottom: 6 }} />
                                        <SkeletonLoader width={80} height={20} />
                                    </View>
                                </Card>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.categoryList}>
                            {categories.length === 0 && (
                                <EmptyState title="No categories found" description='Add a category to add expenses to it'/>
                                
                            )}
                            {categories?.map((category: Category, index: number) => {
                                const accent = accentColors[index % accentColors.length];

                                return (
                                    <TouchableOpacity
                                        key={category._id}
                                        onPress={() => router.push(`/category/${category._id}`)}
                                    >
                                        <Card style={styles.categoryItem} padding="md">
                                            <View style={[styles.categoryAvatar, { backgroundColor: accent + '1A' }]}>
                                                <Text style={[styles.categoryAvatarText, { color: accent }]}>
                                                    {category.name.charAt(0).toUpperCase()}
                                                </Text>
                                            </View>
                                            <View style={styles.categoryItemInfo}>
                                                <Text style={[styles.categoryItemName, { color: colors.text }]}>
                                                    {category.name}
                                                </Text>
                                            </View>
                                        </Card>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Floating Add Button */}
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
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: Spacing.md,
        paddingBottom: 100,
    },
    greetingSection: {
        marginBottom: Spacing.lg,
    },
    greeting: {
        fontSize: Typography.fontSize.sm,
        marginBottom: 4,
    },
    greetingName: {
        fontSize: Typography.fontSize['3xl'],
        fontWeight: Typography.fontWeight.bold,
    },
    summarySection: {
        marginBottom: Spacing.xl,
    },
    primaryCard: {
        marginBottom: Spacing.md,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    primaryCardLabel: {
        fontSize: Typography.fontSize.sm,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 8,
    },
    primaryCardValue: {
        fontSize: Typography.fontSize['4xl'],
        fontWeight: Typography.fontWeight.bold,
        color: '#FFFFFF',
        marginBottom: 12,
    },
    primaryCardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    primaryCardSubtext: {
        fontSize: Typography.fontSize.sm,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    changeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
    },
    changeBadgeText: {
        fontSize: Typography.fontSize.xs,
        fontWeight: Typography.fontWeight.semibold,
    },
    summaryGrid: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    summaryCard: {
        flex: 1,
    },
    summaryLabel: {
        fontSize: Typography.fontSize.sm,
        marginBottom: 6,
    },
    summaryValue: {
        fontSize: Typography.fontSize['2xl'],
        fontWeight: Typography.fontWeight.bold,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    categoryList: {
        gap: Spacing.sm,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    categoryAvatar: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    categoryAvatarText: {
        fontSize: Typography.fontSize.md,
        fontWeight: Typography.fontWeight.bold,
    },
    categoryItemInfo: {
        flex: 1,
    },
    categoryItemName: {
        fontSize: Typography.fontSize.md,
        fontWeight: Typography.fontWeight.medium,
        marginBottom: 4,
    },
    categoryItemAmount: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.semibold,
    },
    percentageBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: BorderRadius.full,
    },
    percentageBadgeText: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.semibold,
    },
    expenseItem: {
        marginBottom: Spacing.sm,
    },
    expenseContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expenseIndicator: {
        width: 4,
        height: 48,
        borderRadius: 2,
        marginRight: Spacing.md,
    },
    expenseDetails: {
        flex: 1,
    },
    expenseDescription: {
        fontSize: Typography.fontSize.md,
        fontWeight: Typography.fontWeight.medium,
        marginBottom: 6,
    },
    expenseMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    expenseCategory: {
        fontSize: Typography.fontSize.sm,
    },
    expenseDot: {
        fontSize: Typography.fontSize.sm,
    },
    expenseDate: {
        fontSize: Typography.fontSize.sm,
    },
    expenseAmount: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.bold,
        marginLeft: Spacing.md,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    fabText: {
        fontSize: 28,
        color: '#FFFFFF',
        fontWeight: Typography.fontWeight.bold,
    },
});