import Constants from 'expo-constants';

interface Config {
    API_BASE_URL: string;
    APP_NAME: string;
    APP_VERSION: string;
    NODE_ENV: string;
}

const getEnvVar = (key: string): string => {
    const extras = (Constants?.expoConfig?.extra || (Constants as any)?.manifest?.extra || {}) as Record<string, any>;
    const value = extras[key] ?? process.env[key];
    if (value === undefined || value === null || value === '') {
        console.warn(`Environment variable ${key} is not defined`);
    }
    return String(value ?? '');
};

export const config: Config = {
    API_BASE_URL: getEnvVar('API_BASE_URL'),
    APP_NAME: getEnvVar('APP_NAME'),
    APP_VERSION: getEnvVar('APP_VERSION'),
    NODE_ENV: getEnvVar('NODE_ENV'),
};

export default config;
