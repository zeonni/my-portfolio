import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'ililota',
  brand: {
    displayName: '일일오따',
    primaryColor: '#6366F1',
    icon: 'https://static.toss.im/appsintoss/63123/c2c1264e-03e0-440d-b9a1-1a3aa0a782b5.png',
  },
  permissions: [],
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },
});
