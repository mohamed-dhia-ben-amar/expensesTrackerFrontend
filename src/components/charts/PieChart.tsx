import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../../hooks/themeHooks/useTheme';
import { Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';

interface PieChartData {
    label: string;
    value: number;
    color: string;
}

interface PieChartProps {
    data: PieChartData[];
    size?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, size = 200 }) => {
    const { colors } = useTheme();
    const radius = size / 2 - 10;
    const centerX = size / 2;
    const centerY = size / 2;

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -90;

    const calculatePath = (percentage: number, startAngle: number) => {
        const angle = (percentage / 100) * 360;
        const endAngle = startAngle + angle;

        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        const x1 = centerX + radius * Math.cos(startRad);
        const y1 = centerY + radius * Math.sin(startRad);
        const x2 = centerX + radius * Math.cos(endRad);
        const y2 = centerY + radius * Math.sin(endRad);

        const largeArc = angle > 180 ? 1 : 0;

        return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    };

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                {data.map((item, index) => {
                    const percentage = (item.value / total) * 100;
                    const path = calculatePath(percentage, currentAngle);
                    currentAngle += (percentage / 100) * 360;

                    return <G key={index}>{/* SVG path rendering - simplified */}</G>;
                })}
            </Svg>

            <View style={styles.legend}>
                {data.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                        <Text style={[styles.legendText, { color: colors.text }]}>
                            {item.label}: {((item.value / total) * 100).toFixed(1)}%
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    legend: {
        marginTop: Spacing.lg,
        width: '100%',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 4,
        marginRight: Spacing.sm,
    },
    legendText: {
        fontSize: Typography.fontSize.sm,
    },
});