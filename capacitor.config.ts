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
  overrideUserAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36",
  appendUserAgent: "Capacitor"
};

export default config;
