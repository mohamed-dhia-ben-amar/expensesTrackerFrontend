import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { useAuth } from '../../src/hooks/authHooks/useAuth';
import { useTheme } from '../../src/hooks/themeHooks/useTheme';
import { Spacing, BorderRadius } from '../../src/theme/spacing';
import { Typography } from '../../src/theme/typography';
import { Pencil } from 'lucide-react-native';

export default function ProfileScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    await logout();
                    router.replace('/(auth)/login');
                },
            },
        ]);
    };

    const goToEdit = () => router.push('/edit-profile');

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Header */}
                <Card style={styles.profileCard}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity
                            style={[styles.editButton, { backgroundColor: colors.primary + '20' }]}
                            onPress={goToEdit}
                        >
                            <Pencil color={colors.primary} size={18} />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
                        <Text style={[styles.avatarText, { color: colors.primary }]}>
                            {user?.firstName?.charAt(0).toUpperCase()}
                        </Text>
                    </View>

                    <Text style={[styles.userName, { color: colors.text }]}>
                        {user?.firstName} {user?.lastName}
                    </Text>
                    <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                        {user?.email}
                    </Text>


                </Card>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Preferences
                    </Text>

                    <Card style={styles.settingsCard}>
                        <View style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingLabel, { color: colors.text }]}>
                                    Dark Mode
                                </Text>
                                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                                    {isDark ? 'Enabled' : 'Disabled'}
                                </Text>
                            </View>
                            <Switch
                                value={isDark}
                                onValueChange={() => {
                                    Alert.alert(
                                        'Theme',
                                        'Theme follows your system settings. Change your device theme to switch between light and dark mode.'
                                    );
                                }}
                                trackColor={{ false: colors.border, true: colors.primary }}
                                thumbColor="#FFFFFF"
                            />
                        </View>

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        <TouchableOpacity style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingLabel, { color: colors.text }]}>
                                    Currency
                                </Text>
                                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                                    USD - US Dollar
                                </Text>
                            </View>
                            <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
                        </TouchableOpacity>

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        <TouchableOpacity style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingLabel, { color: colors.text }]}>
                                    Notifications
                                </Text>
                                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                                    Manage notification preferences
                                </Text>
                            </View>
                            <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
                        </TouchableOpacity>
                    </Card>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>

                    <Card style={styles.settingsCard}>
                        <TouchableOpacity style={styles.settingItem}>
                            <Text style={[styles.settingLabel, { color: colors.text }]}>
                                Privacy Policy
                            </Text>
                            <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
                        </TouchableOpacity>

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        <TouchableOpacity style={styles.settingItem}>
                            <Text style={[styles.settingLabel, { color: colors.text }]}>
                                Terms of Service
                            </Text>
                            <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
                        </TouchableOpacity>

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        <TouchableOpacity style={styles.settingItem}>
                            <Text style={[styles.settingLabel, { color: colors.text }]}>
                                App Version
                            </Text>
                            <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                                1.0.0
                            </Text>
                        </TouchableOpacity>
                    </Card>
                </View>

                {/* Logout */}
                <Button
                    title="Logout"
                    onPress={handleLogout}
                    variant="outline"
                    fullWidth
                    style={{ marginTop: Spacing.md }}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: Spacing.md, paddingBottom: 120 },

    /* Profile Header */
    profileCard: {
        alignItems: 'center',
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.xl,
        marginBottom: Spacing.xl,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 4,
    },
    headerTop: {
        width: '100%',
        alignItems: 'flex-end',
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.md,
    },
    editButton: {
        width: 36,
        height: 36,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    avatarText: {
        fontSize: Typography.fontSize['3xl'],
        fontWeight: Typography.fontWeight.bold,
    },
    userName: {
        fontSize: Typography.fontSize.xl,
        fontWeight: Typography.fontWeight.semibold,
        marginBottom: 2,
    },
    userEmail: {
        fontSize: Typography.fontSize.md,
        color: '#777',
        marginBottom: Spacing.md,
    },

    /* Sections */
    section: { marginBottom: Spacing.xl },
    sectionTitle: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.semibold,
        marginBottom: Spacing.md,
    },
    settingsCard: {
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
    },
    settingInfo: { flex: 1 },
    settingLabel: {
        fontSize: Typography.fontSize.md,
        fontWeight: Typography.fontWeight.medium,
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: Typography.fontSize.sm,
    },
    chevron: { fontSize: 22, marginLeft: Spacing.sm, opacity: 0.5 },
    divider: { height: 1, marginLeft: Spacing.md },
});