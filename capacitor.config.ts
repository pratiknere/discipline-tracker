import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pratik.disciplinetracker',
  appName: 'Discipline Tracker',
  webDir: 'dist/discipline-tracker/browser',
  plugins: {
    LocalNotifications: {
      // Default small icon/color for Android notifications (uses adaptive icon
      // resources generated at res/drawable when you customize the app icon)
      smallIcon: 'ic_stat_icon',
      iconColor: '#1D9E75',
    },
  },
};

export default config;
