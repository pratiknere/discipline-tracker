import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { todayOutline, statsChartOutline, calendarOutline, settingsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="today" href="/tabs/today">
          <ion-icon name="today-outline"></ion-icon>
          <ion-label>Today</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="stats" href="/tabs/stats">
          <ion-icon name="stats-chart-outline"></ion-icon>
          <ion-label>Stats</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="calendar" href="/tabs/calendar">
          <ion-icon name="calendar-outline"></ion-icon>
          <ion-label>Calendar</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="settings" href="/tabs/settings">
          <ion-icon name="settings-outline"></ion-icon>
          <ion-label>Settings</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
})
export class TabsPage {
  constructor() {
    addIcons({ todayOutline, statsChartOutline, calendarOutline, settingsOutline });
  }
}
