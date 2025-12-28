import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aiinterviewprep.app',
  appName: 'AI Interview Prep',
  webDir: 'public',
  server: {
    url: 'https://ai-interview-saas-eight.vercel.app',
    cleartext: false,
    allowNavigation: [
      '*.google.com',
      '*.googleapis.com',
      '*.firebaseapp.com',
      '*.vercel.app',
      'ai-interview-saas-eight.vercel.app',
      '*.googleusercontent.com'
    ],
    errorPath: 'offline.html'
  },
  overrideUserAgent: "Mozilla/5.0 (Linux; Android 14; Mobile; rv:125.0) Gecko/125.0 Firefox/125.0",
  appendUserAgent: "Capacitor"
};

export default config;
