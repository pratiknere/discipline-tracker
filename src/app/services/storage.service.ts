import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

// Wraps @capacitor/preferences. On native Android/iOS this persists to
// real device storage; on plain web builds Capacitor falls back to
// localStorage automatically, so this same service works everywhere.
@Injectable({ providedIn: 'root' })
export class StorageService {
  async get<T>(key: string): Promise<T | null> {
    const { value } = await Preferences.get({ key });
    if (value === null || value === undefined) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    await Preferences.set({ key, value: JSON.stringify(value) });
  }

  async remove(key: string): Promise<void> {
    await Preferences.remove({ key });
  }
}
