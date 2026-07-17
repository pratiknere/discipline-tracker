// A single recurring block in your daily schedule (e.g. Gym, Study Block 1)
export interface ScheduleBlock {
  id: string;          // unique id, e.g. 'gym', 'study-1' — used as notification id seed too
  name: string;         // display name, e.g. 'Gym'
  icon: string;         // ionicon name, e.g. 'barbell-outline'
  startTime: string;    // 24h "HH:mm", e.g. "05:40"
  endTime: string;      // 24h "HH:mm", e.g. "06:40"
  color: string;        // hex color used for the card accent + heatmap
  trackStreak: boolean; // whether this block counts toward its own streak (Work/Sleep might not)
  enabled: boolean;     // whether notifications are scheduled for this block
}

// Status of one block on one specific date
export type BlockStatus = 'done' | 'partial' | 'skipped' | 'pending';

// One day's log — map of blockId -> status
export interface DayLog {
  date: string; // "YYYY-MM-DD"
  statuses: Record<string, BlockStatus>;
}

// Computed streak info per block (or 'overall' for perfect-day streak)
export interface StreakInfo {
  key: string;          // blockId or 'overall'
  current: number;      // current consecutive-day streak
  longest: number;       // longest streak ever recorded
}
