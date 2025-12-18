import { useColorScheme } from 'react-native';
import { Colors, ThemeColors } from '../../theme/theme';

export const useTheme = () => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const colors: ThemeColors = isDark ? Colors.dark : Colors.light;

    return {
        colors,
        isDark,
        colorScheme: colorScheme || 'light',
    };
};