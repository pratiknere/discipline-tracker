import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { ScheduleBlock } from '../models/schedule-block.model';

// Turn a blockId string into a stable positive integer id.
// Capacitor local notifications require numeric ids.
function idFromString(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 1_000_000 + 1;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private channelReady = false;

  async requestPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false; // web has no local-notifications support here
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  }

  // Creates a high-importance Android channel so reminders aren't silently
  // downgraded/delayed by the OS. Safe to call repeatedly.
  private async ensureChannel(): Promise<void> {
    if (this.channelReady || !Capacitor.isNativePlatform()) return;
    await LocalNotifications.createChannel({
      id: 'schedule-reminders',
      name: 'Schedule reminders',
      description: 'Reminders for each block in your daily schedule',
      importance: 5, // IMPORTANCE_HIGH — heads-up notification, bypasses Doze more reliably
      visibility: 1,
      sound: undefined,
      vibration: true,
    });
    this.channelReady = true;
  }

  // Cancels all existing scheduled reminders (used before rescheduling from scratch)
  async cancelAll(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length) {
      await LocalNotifications.cancel({ notifications: pending.notifications.map(n => ({ id: n.id })) });
    }
  }

  // Schedules one daily-repeating notification per enabled block, firing at
  // its startTime every day. Call this on app load and whenever the
  // schedule is edited in Settings.
  async scheduleAll(blocks: ScheduleBlock[]): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    await this.ensureChannel();
    await this.cancelAll();

    const notifications = blocks
      .filter(b => b.enabled)
      .map(b => {
        const [hour, minute] = b.startTime.split(':').map(Number);
        return {
          id: idFromString(b.id),
          title: `Time for ${b.name}`,
          body: `${b.name} starts now (${b.startTime}). Stay on track.`,
          channelId: 'schedule-reminders',
          schedule: { on: { hour, minute }, allowWhileIdle: true },
          smallIcon: 'ic_stat_icon',
        };
      });

    if (notifications.length) {
      await LocalNotifications.schedule({ notifications });
    }
  }
}
