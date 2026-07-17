import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { ScheduleBlock } from '../models/schedule-block.model';

const STORAGE_KEY = 'schedule-blocks-v1';

// Your default daily schedule. Feel free to edit times/names here directly,
// or edit them later from the Settings page in the app itself.
const DEFAULT_BLOCKS: ScheduleBlock[] = [
  { id: 'gym', name: 'Gym', icon: 'barbell-outline', startTime: '05:40', endTime: '06:40', color: '#D85A30', trackStreak: true, enabled: true },
  { id: 'study-1', name: 'Study Block 1 (Core/DSA)', icon: 'book-outline', startTime: '07:10', endTime: '08:25', color: '#378ADD', trackStreak: true, enabled: true },
  { id: 'work-dsa', name: 'DSA practice (in work hours)', icon: 'code-slash-outline', startTime: '13:00', endTime: '14:00', color: '#639922', trackStreak: true, enabled: true },
  { id: 'running', name: 'Running', icon: 'walk-outline', startTime: '18:45', endTime: '19:45', color: '#1D9E75', trackStreak: true, enabled: true },
  { id: 'study-2', name: 'Study Block 2 (Projects/Job prep)', icon: 'laptop-outline', startTime: '20:15', endTime: '22:00', color: '#534AB7', trackStreak: true, enabled: true },
  { id: 'sleep', name: 'Sleep', icon: 'moon-outline', startTime: '22:15', endTime: '05:30', color: '#5F5E5A', trackStreak: false, enabled: true },
];

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  // Reactive signal so pages update instantly when blocks are edited
  blocks = signal<ScheduleBlock[]>(DEFAULT_BLOCKS);
  private loaded = false;

  constructor(private storage: StorageService) {}

  async load(): Promise<ScheduleBlock[]> {
    if (this.loaded) return this.blocks();
    const saved = await this.storage.get<ScheduleBlock[]>(STORAGE_KEY);
    this.blocks.set(saved && saved.length ? saved : DEFAULT_BLOCKS);
    this.loaded = true;
    return this.blocks();
  }

  async save(blocks: ScheduleBlock[]): Promise<void> {
    this.blocks.set(blocks);
    await this.storage.set(STORAGE_KEY, blocks);
  }

  async addOrUpdate(block: ScheduleBlock): Promise<void> {
    const current = this.blocks();
    const idx = current.findIndex(b => b.id === block.id);
    const next = idx >= 0
      ? current.map(b => (b.id === block.id ? block : b))
      : [...current, block];
    await this.save(next);
  }

  async remove(id: string): Promise<void> {
    await this.save(this.blocks().filter(b => b.id !== id));
  }

  streakEligibleBlocks(): ScheduleBlock[] {
    return this.blocks().filter(b => b.trackStreak);
  }
}
