import { Injectable } from '@angular/core';
import { LogService, todayKey } from './log.service';
import { ScheduleService } from './schedule.service';
import { StreakInfo } from '../models/schedule-block.model';

// A day counts as a "hit" for a block if status is 'done' or 'partial'.
// Only 'skipped' or missing/'pending' breaks the streak.
function isHit(status: string | undefined): boolean {
  return status === 'done' || status === 'partial';
}

function addDays(dateStr: string, delta: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + delta);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

@Injectable({ providedIn: 'root' })
export class StreakService {
  constructor(private logService: LogService, private scheduleService: ScheduleService) {}

  // Streak for a single block id. Walks backward from today.
  streakForBlock(blockId: string): StreakInfo {
    return this.computeStreak(date => isHit(this.logService.getDay(date).statuses[blockId]));
  }

  // "Perfect day" streak: every streak-eligible block was done/partial that day.
  overallStreak(): StreakInfo {
    const blocks = this.scheduleService.streakEligibleBlocks();
    return this.computeStreak(date => {
      if (blocks.length === 0) return false;
      const day = this.logService.getDay(date);
      return blocks.every(b => isHit(day.statuses[b.id]));
    });
  }

  private computeStreak(hitFn: (date: string) => boolean): StreakInfo {
    const today = todayKey();

    // Current streak: count backward from today while hitFn is true.
    // Today itself only breaks the streak if it's already been marked a miss;
    // if today has no logs yet we don't penalize it (day isn't over).
    let current = 0;
    let cursor = today;
    let first = true;
    while (true) {
      const hit = hitFn(cursor);
      if (hit) {
        current++;
      } else if (first) {
        // today undecided yet — skip penalizing, just move to yesterday
      } else {
        break;
      }
      first = false;
      cursor = addDays(cursor, -1);
      if (current > 3650) break; // safety cap
    }

    // Longest streak: scan all logged dates for the longest run of hits.
    const dates = this.logService.loggedDatesSorted();
    let longest = 0;
    let run = 0;
    let prevDate: string | null = null;
    for (const date of dates) {
      const hit = hitFn(date);
      if (hit) {
        run = prevDate && addDays(prevDate, 1) === date ? run + 1 : 1;
      } else {
        run = 0;
      }
      longest = Math.max(longest, run);
      prevDate = date;
    }
    longest = Math.max(longest, current);

    return { key: 'streak', current, longest };
  }
}
