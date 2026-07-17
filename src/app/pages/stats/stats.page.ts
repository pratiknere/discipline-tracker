import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { flameOutline, trophyOutline } from 'ionicons/icons';
import { ScheduleService } from '../../services/schedule.service';
import { LogService, todayKey } from '../../services/log.service';
import { StreakService } from '../../services/streak.service';
import { ScheduleBlock } from '../../models/schedule-block.model';

interface BlockStat {
  block: ScheduleBlock;
  current: number;
  longest: number;
  weekPercent: number;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon],
  templateUrl: './stats.page.html',
  styleUrl: './stats.page.scss',
})
export class StatsPage implements OnInit {
  stats = signal<BlockStat[]>([]);
  overallCurrent = signal(0);
  overallLongest = signal(0);
  weekOverallPercent = signal(0);

  constructor(
    private scheduleService: ScheduleService,
    private logService: LogService,
    private streakService: StreakService,
  ) {
    addIcons({ flameOutline, trophyOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.scheduleService.load();
    await this.logService.load();
    this.computeStats();
  }

  private last7Dates(): string[] {
    const dates: string[] = [];
    const base = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(base.getDate() - i);
      dates.push(todayKey(d));
    }
    return dates;
  }

  private computeStats(): void {
    const blocks = this.scheduleService.streakEligibleBlocks();
    const week = this.last7Dates();

    const stats: BlockStat[] = blocks.map(block => {
      const { current, longest } = this.streakService.streakForBlock(block.id);
      const hits = week.filter(date => {
        const s = this.logService.getDay(date).statuses[block.id];
        return s === 'done' || s === 'partial';
      }).length;
      return { block, current, longest, weekPercent: Math.round((hits / 7) * 100) };
    });
    this.stats.set(stats);

    const overall = this.streakService.overallStreak();
    this.overallCurrent.set(overall.current);
    this.overallLongest.set(overall.longest);

    const perfectDaysThisWeek = week.filter(date => {
      const day = this.logService.getDay(date);
      return blocks.length > 0 && blocks.every(b => {
        const s = day.statuses[b.id];
        return s === 'done' || s === 'partial';
      });
    }).length;
    this.weekOverallPercent.set(Math.round((perfectDaysThisWeek / 7) * 100));
  }
}
