import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ExpenseListItem } from '../../src/components/expense/ExpenseListItem';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { SkeletonLoader } from '../../src/components/ui/SkeletonLoader';
import { groupExpensesByDate } from '../../src/utils/date';
import { useExpenses } from '../../src/hooks/expenseHooks/useExpenses';
import { useTheme } from '../../src/hooks/themeHooks/useTheme';
import { Spacing } from '../../src/theme/spacing';
import { Typography } from '../../src/theme/typography';

export default function ExpensesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { expenses, isLoading, refetch } = useExpenses();
  const [refreshing, setRefreshing] = React.useState(false);

  const groupedExpenses = React.useMemo(() => {
    return groupExpensesByDate(expenses);
  }, [expenses]);

  const sections = React.useMemo(() => {
    return Object.entries(groupedExpenses).map(([date, items]) => ({
      date,
      data: items,
    }));
  }, [groupedExpenses]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={{ marginBottom: Spacing.md }}>
              <SkeletonLoader width={100} height={16} style={{ marginBottom: 8 }} />
              <SkeletonLoader width="100%" height={80} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (expenses.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          title="No expenses yet"
          description="Start tracking your expenses by tapping the + button"
        />
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/expense/create')}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <Text style={[styles.dateHeader, { color: colors.textSecondary }]}>
              {item.date}
            </Text>
            {item.data.map((expense) => (
              <ExpenseListItem
                key={(expense as any)._id}
                expense={expense as any}
                onPress={() => router.push(`/expense/${(expense as any)._id}`)}
              />
            ))}
          </View>
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

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
  content: {
    padding: Spacing.md,
  },
  list: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  dateHeader: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  fab: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
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