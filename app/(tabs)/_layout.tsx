import { Tabs, Redirect } from 'expo-router';
import { Text } from 'react-native';
import { LoadingScreen } from '../../src/components/ui/LoadingScreen';
import { useAuth } from '../../src/hooks/authHooks/useAuth';
import { useTheme } from '../../src/hooks/themeHooks/useTheme';

// Simple icon components (you can replace with lucide-react-native icons)
const HomeIcon = ({ color }: { color: string }) => (
    <Text style={{ fontSize: 24 }}>🏠</Text>
);
const ExpenseIcon = ({ color }: { color: string }) => (
    <Text style={{ fontSize: 24 }}>💰</Text>
);
const CategoryIcon = ({ color }: { color: string }) => (
    <Text style={{ fontSize: 24 }}>📁</Text>
);
const StatsIcon = ({ color }: { color: string }) => (
    <Text style={{ fontSize: 24 }}>📊</Text>
);
const ProfileIcon = ({ color }: { color: string }) => (
    <Text style={{ fontSize: 24 }}>👤</Text>
);

export default function TabsLayout() {
    const { colors } = useTheme();
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    // Redirect to verification if user is not verified
    if (user && !user.isVerified) {
        return <Redirect href="/verification-required" />;
    }

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    paddingTop: 12,
                    paddingBottom: 12,
                    paddingHorizontal: 10,
                    height: 80,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
                headerStyle: {
                    backgroundColor: colors.background,
                },
                headerTintColor: colors.text,
                headerShadowVisible: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => <HomeIcon color={color} />,
                }}
            />
            <Tabs.Screen
                name="expenses"
                options={{
                    title: 'Expenses',
                    tabBarIcon: ({ color }) => <ExpenseIcon color={color} />,
                }}
            />
            <Tabs.Screen
                name="categories"
                options={{
                    title: 'Categories',
                    tabBarIcon: ({ color }) => <CategoryIcon color={color} />,
                }}
            />
            <Tabs.Screen
                name="statistics"
                options={{
                    title: 'Statistics',
                    tabBarLabel: 'Stats',
                    tabBarIcon: ({ color }) => <StatsIcon color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
                }}
            />
        </Tabs>
    );
}