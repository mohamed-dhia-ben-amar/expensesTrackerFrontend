import { useAuth } from '../hooks/authHooks/useAuth';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

/**
 * Hook to guard actions that require email verification
 * Returns a function that checks verification before executing the action
 */
export const useVerificationGuard = () => {
    const { user } = useAuth();
    const router = useRouter();

    const requireVerification = (action: () => void | Promise<void>, message?: string) => {
        if (!user?.isVerified) {
            Alert.alert(
                'Verification Required',
                message || 'Please verify your email to use this feature.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Verify Now',
                        onPress: () => router.push({
                            pathname: '/(auth)/verify-email',
                            params: { email: user?.email || '' }
                        })
                    }
                ]
            );
            return;
        }
        action();
    };

    return { requireVerification, isVerified: user?.isVerified ?? false };
};
