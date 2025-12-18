import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Modal,
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
import { Input } from '../../src/components/ui/Input';
import { showApiErrorAlert } from '@/utils/apiError';
import { useCategories } from '../../src/hooks/categoryHooks/useCategories';
import { Pencil, X } from 'lucide-react-native';

export default function ExpenseDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();
    const { data: expense, isLoading, refetch } = useExpense(id);
    const { deleteExpense, isDeleting, updateExpense, isUpdating } = useExpenses();
    const { categories } = useCategories();
    const [editing, setEditing] = useState(false);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');

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
                        showApiErrorAlert(error, { fallbackMessage: 'Failed to delete expense' });
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

    const startEdit = () => {
        setAmount(expense.amount?.toString() || '');
        setDescription(expense.description || '');
        const catId = typeof expense.category === 'object' && expense.category?._id 
            ? expense.category._id 
            : expense.category;
        setCategoryId(catId || '');
        setEditing(true);
    };

    const submitEdit = async () => {
        try {
            await updateExpense({ 
                id, 
                data: { 
                    amount: parseFloat(amount), 
                    description, 
                    category: categoryId,
                    date: expense.date 
                } 
            });
            setEditing(false);
            await refetch();
        } catch (error) {
            showApiErrorAlert(error, { fallbackMessage: 'Failed to update expense' });
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {!editing && (
                    <TouchableOpacity onPress={startEdit} style={[styles.iconButton, { backgroundColor: colors.card }]}>
                        <Pencil color={colors.text} size={18} />
                    </TouchableOpacity>
                )}
                {/* Inline editor removed; using modal below */}
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

                {!editing && (
                    <View style={styles.actions}>
                        <Button
                            title="Delete"
                            onPress={handleDelete}
                            variant="outline"
                            fullWidth
                            loading={isDeleting}
                            style={styles.actionButton}
                        />
                    </View>
                )}
            </ScrollView>

            {/* Edit Modal */}
            <Modal visible={editing} transparent animationType="fade" onRequestClose={() => setEditing(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card || colors.background }]}>
                        <View style={{ alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={() => setEditing(false)} style={[styles.closeButton, { backgroundColor: colors.background }]}>
                                <X color={colors.text} size={18} />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Expense</Text>
                        
                        <Input 
                            label="Amount" 
                            value={amount} 
                            onChangeText={setAmount} 
                            keyboardType="decimal-pad"
                            placeholder="0.00"
                            containerStyle={{ paddingVertical: Spacing.sm }} 
                        />
                        
                        <Input 
                            label="Description" 
                            value={description} 
                            onChangeText={setDescription} 
                            placeholder="What did you spend on?"
                            containerStyle={{ paddingVertical: Spacing.sm }} 
                        />
                        
                        <View style={{ paddingVertical: Spacing.sm }}>
                            <Text style={[styles.label, { color: colors.text }]}>Category</Text>
                            <View style={styles.categoryGrid}>
                                {categories.map((cat: any) => {
                                    const selected = categoryId === cat._id;
                                    return (
                                        <TouchableOpacity
                                            key={cat._id}
                                            style={[
                                                styles.categoryChip,
                                                {
                                                    backgroundColor: selected ? colors.primary : colors.surface,
                                                    borderColor: selected ? colors.primary : colors.border ?? '#E5E7EB',
                                                },
                                            ]}
                                            onPress={() => setCategoryId(cat._id)}
                                        >
                                            <Text
                                                style={[
                                                    styles.categoryChipText,
                                                    { color: selected ? '#FFFFFF' : colors.text },
                                                ]}
                                            >
                                                {cat.name}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                        
                        <View style={{ flexDirection: 'row', gap: Spacing.sm, paddingTop: Spacing.md }}>
                            <Button title={isUpdating ? 'Saving…' : 'Save'} onPress={submitEdit} loading={isUpdating} fullWidth />
                            <Button title="Cancel" onPress={() => setEditing(false)} variant="outline" fullWidth />
                        </View>
                    </View>
                </View>
            </Modal>
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
    iconButton: {
        position: 'absolute',
        right: Spacing.md,
        top: Spacing.md,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        zIndex: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '92%',
        borderRadius: 20,
        padding: Spacing.md,
        maxHeight: '90%',
    },
    modalTitle: {
        fontSize: Typography.fontSize.xl,
        fontWeight: Typography.fontWeight.bold,
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.medium,
        marginBottom: Spacing.xs,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        marginTop: Spacing.xs,
    },
    categoryChip: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
    },
    categoryChipText: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.medium,
    },
});