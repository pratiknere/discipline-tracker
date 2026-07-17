import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { ScheduleService } from '../../services/schedule.service';
import { LogService, todayKey } from '../../services/log.service';
import { ScheduleBlock } from '../../models/schedule-block.model';

interface DayCell {
  date: string;
  level: 0 | 1 | 2; // 0 = pending/skipped, 1 = partial, 2 = done
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel],
  templateUrl: './calendar.page.html',
  styleUrl: './calendar.page.scss',
})
export class CalendarPage implements OnInit {
  blocks = signal<ScheduleBlock[]>([]);
  selectedBlockId = signal<string>('');
  rangeDays = signal<30 | 90>(30);
  cells = signal<DayCell[]>([]);

  constructor(private scheduleService: ScheduleService, private logService: LogService) {}

  async ngOnInit(): Promise<void> {
    await this.scheduleService.load();
    await this.logService.load();
    const blocks = this.scheduleService.streakEligibleBlocks();
    this.blocks.set(blocks);
    if (blocks.length) {
      this.selectedBlockId.set(blocks[0].id);
    }
    this.computeCells();
  }

  onBlockChange(blockId: string): void {
    this.selectedBlockId.set(blockId);
    this.computeCells();
  }

  onRangeChange(days: 30 | 90): void {
    this.rangeDays.set(days);
    this.computeCells();
  }

  private computeCells(): void {
    const blockId = this.selectedBlockId();
    if (!blockId) {
      this.cells.set([]);
      return;
    }
    const n = this.rangeDays();
    const today = new Date();
    const result: DayCell[] = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = todayKey(d);
      const status = this.logService.getDay(key).statuses[blockId];
      const level: 0 | 1 | 2 = status === 'done' ? 2 : status === 'partial' ? 1 : 0;
      result.push({ date: key, level });
    }
    this.cells.set(result);
  }
}
