import React from 'react';
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { useTheme } from '../../hooks/themeHooks/useTheme';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    style,
}) => {
    const { colors } = useTheme();

    const getButtonStyle = (): ViewStyle => {
        const base: ViewStyle = {
            borderRadius: BorderRadius.md,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
        };

        // Size
        if (size === 'sm') {
            base.paddingVertical = Spacing.sm;
            base.paddingHorizontal = Spacing.md;
        } else if (size === 'lg') {
            base.paddingVertical = Spacing.md + 2;
            base.paddingHorizontal = Spacing.lg;
        } else {
            base.paddingVertical = Spacing.md;
            base.paddingHorizontal = Spacing.lg;
        }

        // Variant
        if (variant === 'primary') {
            base.backgroundColor = colors.primary;
        } else if (variant === 'secondary') {
            base.backgroundColor = colors.secondary;
        } else if (variant === 'outline') {
            base.backgroundColor = 'transparent';
            base.borderWidth = 1;
            base.borderColor = colors.border;
        } else if (variant === 'ghost') {
            base.backgroundColor = 'transparent';
        }

        if (disabled) {
            base.opacity = 0.5;
        }

        if (fullWidth) {
            base.width = '100%';
        }

        return base;
    };

    const getTextStyle = (): TextStyle => {
        const base: TextStyle = {
            fontWeight: Typography.fontWeight.semibold,
        };

        if (size === 'sm') {
            base.fontSize = Typography.fontSize.sm;
        } else if (size === 'lg') {
            base.fontSize = Typography.fontSize.lg;
        } else {
            base.fontSize = Typography.fontSize.md;
        }

        if (variant === 'primary' || variant === 'secondary') {
            base.color = '#FFFFFF';
        } else {
            base.color = colors.text;
        }

        return base;
    };

    return (
        <TouchableOpacity
            style={[getButtonStyle(), style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? colors.primary : '#FFFFFF'} />
            ) : (
                <Text style={getTextStyle()}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};