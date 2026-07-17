import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'tabs/today', pathMatch: 'full' },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      { path: '', redirectTo: 'today', pathMatch: 'full' },
      { path: 'today', loadComponent: () => import('./pages/today/today.page').then(m => m.TodayPage) },
      { path: 'stats', loadComponent: () => import('./pages/stats/stats.page').then(m => m.StatsPage) },
      { path: 'calendar', loadComponent: () => import('./pages/calendar/calendar.page').then(m => m.CalendarPage) },
      { path: 'settings', loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage) },
    ],
  },
];
