import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aiinterviewprep.app',
  appName: 'AI Interview Prep',
  webDir: 'public',
  server: {
    url: 'https://ai-interview-saas-eight.vercel.app',
    cleartext: false,
  },
};

export default config;
