import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { BlockStatus, DayLog } from '../models/schedule-block.model';

const STORAGE_KEY = 'day-logs-v1';

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

@Injectable({ providedIn: 'root' })
export class LogService {
  // date -> DayLog, kept in memory as a signal and mirrored to storage
  private logs = signal<Record<string, DayLog>>({});
  private loaded = false;

  constructor(private storage: StorageService) {}

  async load(): Promise<Record<string, DayLog>> {
    if (this.loaded) return this.logs();
    const saved = await this.storage.get<Record<string, DayLog>>(STORAGE_KEY);
    this.logs.set(saved ?? {});
    this.loaded = true;
    return this.logs();
  }

  private async persist(): Promise<void> {
    await this.storage.set(STORAGE_KEY, this.logs());
  }

  getDay(date: string): DayLog {
    return this.logs()[date] ?? { date, statuses: {} };
  }

  allLogs(): Record<string, DayLog> {
    return this.logs();
  }

  async setStatus(date: string, blockId: string, status: BlockStatus): Promise<void> {
    const current = { ...this.logs() };
    const day = current[date] ?? { date, statuses: {} };
    current[date] = { date, statuses: { ...day.statuses, [blockId]: status } };
    this.logs.set(current);
    await this.persist();
  }

  // All dates that have at least one logged status, sorted ascending
  loggedDatesSorted(): string[] {
    return Object.keys(this.logs()).sort();
  }
}
