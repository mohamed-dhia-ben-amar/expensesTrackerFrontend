import 'dotenv/config';

// Enhance existing app.json config by merging env-driven extras
export default ({ config }: any) => ({
  ...config,
  extra: {
    ...(config?.extra || {}),
    API_BASE_URL: config?.extra?.API_BASE_URL,
    APP_NAME: config?.extra?.APP_NAME ?? config?.name,
    APP_VERSION: config?.extra?.APP_VERSION,
    NODE_ENV: config?.extra?.NODE_ENV,
  },
});
