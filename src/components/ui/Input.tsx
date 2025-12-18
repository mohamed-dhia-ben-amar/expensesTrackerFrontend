import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../../hooks/themeHooks/useTheme';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { Typography } from '../../theme/typography';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: any;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    containerStyle,
    style,
    ...props
}) => {
    const { colors } = useTheme();

    return (
        <View style={containerStyle}>
            {label && (
                <Text
                    style={{
                        fontSize: Typography.fontSize.sm,
                        fontWeight: Typography.fontWeight.medium,
                        color: colors.text,
                        marginBottom: Spacing.xs,
                    }}
                >
                    {label}
                </Text>
            )}
            <TextInput
                style={[
                    {
                        backgroundColor: colors.surface,
                        borderWidth: 1,
                        borderColor: error ? colors.error : colors.border,
                        borderRadius: BorderRadius.md,
                        padding: Spacing.md,
                        fontSize: Typography.fontSize.md,
                        color: colors.text,
                    },
                    style,
                ]}
                placeholderTextColor={colors.textSecondary}
                {...props}
            />
            {error && (
                <Text
                    style={{
                        fontSize: Typography.fontSize.xs,
                        color: colors.error,
                        marginTop: Spacing.xs,
                    }}
                >
                    {error}
                </Text>
            )}
        </View>
    );
};