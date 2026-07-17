import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
  IonIcon, IonBadge, IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, removeCircleOutline, closeCircleOutline, timeOutline } from 'ionicons/icons';
import { ScheduleService } from '../../services/schedule.service';
import { LogService, todayKey } from '../../services/log.service';
import { StreakService } from '../../services/streak.service';
import { BlockStatus, ScheduleBlock } from '../../models/schedule-block.model';

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonIcon, IonBadge, IonButton],
  templateUrl: './today.page.html',
  styleUrl: './today.page.scss',
})
export class TodayPage implements OnInit {
  blocks = signal<ScheduleBlock[]>([]);
  today = todayKey();
  statuses = signal<Record<string, BlockStatus>>({});
  perfectDayStreak = signal(0);

  constructor(
    private scheduleService: ScheduleService,
    private logService: LogService,
    private streakService: StreakService,
  ) {
    addIcons({ checkmarkCircle, removeCircleOutline, closeCircleOutline, timeOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.scheduleService.load();
    await this.logService.load();
    this.blocks.set(this.scheduleService.blocks());
    this.refreshStatuses();
  }

  private refreshStatuses(): void {
    this.statuses.set(this.logService.getDay(this.today).statuses);
    this.perfectDayStreak.set(this.streakService.overallStreak().current);
  }

  statusFor(blockId: string): BlockStatus {
    return this.statuses()[blockId] ?? 'pending';
  }

  async setStatus(block: ScheduleBlock, status: BlockStatus): Promise<void> {
    await this.logService.setStatus(this.today, block.id, status);
    this.refreshStatuses();
  }

  completionPercent(): number {
    const eligible = this.blocks();
    if (!eligible.length) return 0;
    const hits = eligible.filter(b => {
      const s = this.statusFor(b.id);
      return s === 'done' || s === 'partial';
    }).length;
    return Math.round((hits / eligible.length) * 100);
  }
}
