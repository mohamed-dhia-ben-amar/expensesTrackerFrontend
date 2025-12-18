import React from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../src/hooks/themeHooks/useTheme';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
});

function RootLayoutNav() {
    const { colors, colorScheme } = useTheme();

    return (
        <>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.background,
                    },
                    headerTintColor: colors.text,
                    headerShadowVisible: false,
                    headerTitleStyle: {
                        fontWeight: '600',
                    },
                }}
            >
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="expense/create"
                    options={{
                        presentation: 'modal',
                        title: 'Add Expense',
                    }}
                />
                <Stack.Screen
                    name="expense/[id]"
                    options={{
                        title: 'Expense Details',
                    }}
                />
                <Stack.Screen
                    name="category/create"
                    options={{
                        presentation: 'modal',
                        title: 'New Category',
                    }}
                />
                <Stack.Screen
                    name="category/[id]"
                    options={{
                        title: 'Category Details',
                    }}
                />
                <Stack.Screen
                    name="verification-required"
                    options={{ headerShown: false, gestureEnabled: false }}
                />
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
                <RootLayoutNav />
            </QueryClientProvider>
        </GestureHandlerRootView>
    );
}