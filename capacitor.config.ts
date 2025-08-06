import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.53798b452b7b4d20b3f5467a724ca514',
  appName: 'r3-communities',
  webDir: 'dist',
  server: {
    url: 'https://53798b45-2b7b-4d20-b3f5-467a724ca514.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000'
    }
  }
};

export default config;