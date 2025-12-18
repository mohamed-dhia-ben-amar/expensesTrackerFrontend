import React, { useEffect, useRef } from 'react';
import { ViewStyle, Animated } from 'react-native';
import { useTheme } from '../../hooks/themeHooks/useTheme';
import { BorderRadius } from '../../theme/spacing';

interface SkeletonLoaderProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    width = '100%',
    height = 20,
    borderRadius = BorderRadius.sm,
    style,
}) => {
    const { colors } = useTheme();
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={[
                {
                    width: typeof width === 'string' ? width : width,
                    height,
                    borderRadius,
                    backgroundColor: colors.border,
                    opacity,
                } as any,
                style,
            ]}
        />
    );
};