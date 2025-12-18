import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/themeHooks/useTheme';
import { Spacing, BorderRadius } from '../../theme/spacing';

interface CardProps {
    children: ReactNode;
    style?: ViewStyle;
    padding?: keyof typeof Spacing;
}

export const Card: React.FC<CardProps> = ({ children, style, padding = 'md' }) => {
    const { colors } = useTheme();

    return (
        <View
            style={[
                {
                    backgroundColor: colors.card,
                    borderRadius: BorderRadius.lg,
                    padding: Spacing[padding],
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
};