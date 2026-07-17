import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ScheduleService } from './services/schedule.service';
import { LogService } from './services/log.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
})
export class AppComponent implements OnInit {
  constructor(
    private scheduleService: ScheduleService,
    private logService: LogService,
    private notificationService: NotificationService,
  ) {}

  async ngOnInit(): Promise<void> {
    // Load persisted data first
    const blocks = await this.scheduleService.load();
    await this.logService.load();

    // Ask for notification permission, then schedule daily reminders for
    // every enabled block. Safe no-op on plain web builds.
    const granted = await this.notificationService.requestPermission();
    if (granted) {
      await this.notificationService.scheduleAll(blocks);
    }
  }
}
