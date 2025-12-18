import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/themeHooks/useTheme';
import { Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';

interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {description && (
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                    {description}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    title: {
        fontSize: Typography.fontSize.xl,
        fontWeight: Typography.fontWeight.semibold,
        marginBottom: Spacing.sm,
    },
    description: {
        fontSize: Typography.fontSize.md,
        textAlign: 'center',
    },
});