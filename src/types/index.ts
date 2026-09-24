/**
 * PillPulse - Type Definitions
 * Developer: Suhail Akhtar (https://suhail.top)
 */

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night' | 'custom';

export type PillShape = 'capsule' | 'tablet' | 'liquid' | 'injection' | 'drop';

export type PillColor = 'teal' | 'sky' | 'indigo' | 'purple' | 'amber' | 'emerald' | 'rose' | 'coral';

export type DoseStatus = 'pending' | 'taken' | 'snoozed' | 'skipped';

export type SoundPreset = 'zen' | 'marimba' | 'pulse' | 'urgent' | 'harp';

export interface Medicine {
  id: string;
  name: string;
  dosage: string; // e.g. "500mg", "1 capsule", "2 drops"
  instructions: string; // e.g. "Take with food", "Empty stomach", "Drink full glass of water"
  shape: PillShape;
  color: PillColor;
  inventoryCount?: number;
  lowStockThreshold?: number;
  createdAt: string;
}

export interface RoutineItem {
  medicineId: string;
  stepOrder: number; // 1-indexed: 1, 2, 3
  offsetMinutes: number; // 0, 5, 10, etc. (cumulative from routine start)
  gapFromPrevious?: number; // 0 = no gap / take together, 5 = 5m gap, 10, 15, 30, etc.
  notes?: string;
}

export interface Routine {
  id: string;
  name: string;
  slot: TimeSlot;
  startTime: string; // "08:00" (24h)
  intervalMinutes: number; // default 5 minutes
  items: RoutineItem[];
  active: boolean;
  daysOfWeek: number[]; // [0,1,2,3,4,5,6] - 0=Sunday
  createdAt: string;
}

export interface ScheduledDose {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  instructions: string;
  shape: PillShape;
  color: PillColor;
  scheduledTime: string; // "08:00"
  scheduledDate: string; // "YYYY-MM-DD"
  slot: TimeSlot;
  status: DoseStatus;
  takenAt?: string;
  snoozedUntil?: string;
  // Cascading routine metadata
  routineId?: string;
  routineName?: string;
  stepIndex?: number; // 1
  totalSteps?: number; // 3
  nextMedicineName?: string;
  nextStepGapMinutes?: number;
}

export interface SlotTimeSettings {
  morning: string; // e.g. "08:00"
  afternoon: string; // e.g. "13:00"
  evening: string; // e.g. "19:00"
  night: string; // e.g. "22:00"
}

export type ThemeColor = 'blue' | 'teal' | 'indigo' | 'purple' | 'emerald' | 'orange' | 'rose';

export interface NotificationSettings {
  soundEnabled: boolean;
  soundPreset: SoundPreset;
  soundVolume: number; // 0.1 to 1.0
  soundRepeat: number; // 1 to 5
  browserNotifications: boolean;
  vibrateEnabled: boolean;
  slotTimes?: SlotTimeSettings;
  themeColor?: ThemeColor;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

export interface DoseHistoryLog {
  id: string;
  doseId: string;
  medicineName: string;
  dosage: string;
  scheduledTime: string;
  takenAt: string;
  status: DoseStatus;
  routineName?: string;
}
