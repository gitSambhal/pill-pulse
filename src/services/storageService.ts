/**
 * PillPulse - Local Storage & Data Management Service
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import {
  Medicine,
  Routine,
  ScheduledDose,
  NotificationSettings,
  DoseHistoryLog,
  SlotTimeSettings,
} from '../types';

const STORAGE_KEYS = {
  MEDICINES: 'pillpulse_medicines_v1',
  ROUTINES: 'pillpulse_routines_v1',
  DOSES: 'pillpulse_doses_v1',
  SETTINGS: 'pillpulse_settings_v1',
  HISTORY: 'pillpulse_history_v1',
  THEME: 'pillpulse_theme_v1',
  THEME_COLOR: 'pillpulse_accent_color_v1',
};

export const DEFAULT_SLOT_TIMES: SlotTimeSettings = {
  morning: '08:00',
  afternoon: '13:00',
  evening: '19:00',
  night: '22:00',
};

const DEFAULT_SETTINGS: NotificationSettings = {
  soundEnabled: true,
  soundPreset: 'zen',
  soundVolume: 0.85,
  soundRepeat: 2,
  browserNotifications: false,
  vibrateEnabled: true,
  slotTimes: DEFAULT_SLOT_TIMES,
  themeColor: 'blue',
};

// Seed initial medicines
const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med-1',
    name: 'Levothyroxine',
    dosage: '50 mcg',
    instructions: 'Take 1st on empty stomach with a full glass of water',
    shape: 'tablet',
    color: 'teal',
    inventoryCount: 42,
    lowStockThreshold: 10,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-2',
    name: 'Vitamin D3 + K2',
    dosage: '2,000 IU',
    instructions: 'Take 5 mins after morning drink',
    shape: 'drop',
    color: 'amber',
    inventoryCount: 60,
    lowStockThreshold: 15,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-3',
    name: 'Omega-3 EPA/DHA',
    dosage: '1,000 mg',
    instructions: 'Take with breakfast or morning snack',
    shape: 'capsule',
    color: 'sky',
    inventoryCount: 28,
    lowStockThreshold: 7,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-4',
    name: 'Probiotic Bio-Active',
    dosage: '1 capsule',
    instructions: 'Take 30 mins after lunch with water',
    shape: 'capsule',
    color: 'emerald',
    inventoryCount: 18,
    lowStockThreshold: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-5',
    name: 'Magnesium Glycinate',
    dosage: '200 mg',
    instructions: 'Take 30 mins before sleep to support relaxation',
    shape: 'capsule',
    color: 'purple',
    inventoryCount: 35,
    lowStockThreshold: 10,
    createdAt: new Date().toISOString(),
  },
];

// Seed initial cascading routine: 3 medicines, 5 minutes apart in the morning!
const INITIAL_ROUTINES: Routine[] = [
  {
    id: 'routine-morning-trio',
    name: 'Morning Vital Stack (5 min gap)',
    slot: 'morning',
    startTime: '08:00',
    intervalMinutes: 5,
    active: true,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // everyday
    createdAt: new Date().toISOString(),
    items: [
      { medicineId: 'med-1', stepOrder: 1, offsetMinutes: 0, notes: 'Step 1: On empty stomach' },
      { medicineId: 'med-2', stepOrder: 2, offsetMinutes: 5, notes: 'Step 2: 5 minutes after Step 1' },
      { medicineId: 'med-3', stepOrder: 3, offsetMinutes: 10, notes: 'Step 3: 5 minutes after Step 2' },
    ],
  },
];

export const storageService = {
  getMedicines(): Medicine[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEDICINES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(INITIAL_MEDICINES));
        return INITIAL_MEDICINES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MEDICINES;
    }
  },

  saveMedicines(medicines: Medicine[]): void {
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
  },

  getRoutines(): Routine[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROUTINES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(INITIAL_ROUTINES));
        return INITIAL_ROUTINES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ROUTINES;
    }
  },

  saveRoutines(routines: Routine[]): void {
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
  },

  getSettings(): NotificationSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
      }
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        slotTimes: {
          ...DEFAULT_SLOT_TIMES,
          ...(parsed.slotTimes || {}),
        },
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: NotificationSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getHistory(): DoseHistoryLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveHistory(history: DoseHistoryLog[]): void {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  },

  getDosesForDate(dateStr: string): ScheduledDose[] {
    try {
      const allDosesData = localStorage.getItem(STORAGE_KEYS.DOSES);
      const allDoses: Record<string, ScheduledDose[]> = allDosesData ? JSON.parse(allDosesData) : {};
      
      if (allDoses[dateStr]) {
        return allDoses[dateStr];
      }

      // Generate doses for this date from active routines and medicines
      const generated = this.generateDosesForDate(dateStr);
      allDoses[dateStr] = generated;
      localStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(allDoses));
      return generated;
    } catch {
      return this.generateDosesForDate(dateStr);
    }
  },

  saveDosesForDate(dateStr: string, doses: ScheduledDose[]): void {
    try {
      const allDosesData = localStorage.getItem(STORAGE_KEYS.DOSES);
      const allDoses: Record<string, ScheduledDose[]> = allDosesData ? JSON.parse(allDosesData) : {};
      allDoses[dateStr] = doses;
      localStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(allDoses));
    } catch (e) {
      console.error('Failed to save doses', e);
    }
  },

  generateDosesForDate(dateStr: string): ScheduledDose[] {
    const medicines = this.getMedicines();
    const routines = this.getRoutines();
    const medMap = new Map(medicines.map((m) => [m.id, m]));
    const targetDate = new Date(`${dateStr}T12:00:00`);
    const dayOfWeek = targetDate.getDay();

    const doses: ScheduledDose[] = [];

    // Process routines
    routines
      .filter((r) => r.active && r.daysOfWeek.includes(dayOfWeek))
      .forEach((routine) => {
        const sortedItems = [...routine.items].sort((a, b) => a.stepOrder - b.stepOrder);
        const [baseHours, baseMinutes] = routine.startTime.split(':').map(Number);

        sortedItems.forEach((item, index) => {
          const med = medMap.get(item.medicineId);
          if (!med) return;

          const totalMinutes = baseHours * 60 + baseMinutes + item.offsetMinutes;
          const hours = Math.floor(totalMinutes / 60) % 24;
          const mins = totalMinutes % 60;
          const timeStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;

          const nextItem = sortedItems[index + 1];
          const nextMed = nextItem ? medMap.get(nextItem.medicineId) : undefined;
          const nextGap = nextItem ? nextItem.offsetMinutes - item.offsetMinutes : undefined;

          doses.push({
            id: `${dateStr}-${routine.id}-step-${item.stepOrder}`,
            medicineId: med.id,
            medicineName: med.name,
            dosage: med.dosage,
            instructions: item.notes || med.instructions,
            shape: med.shape,
            color: med.color,
            scheduledTime: timeStr,
            scheduledDate: dateStr,
            slot: routine.slot,
            status: 'pending',
            routineId: routine.id,
            routineName: routine.name,
            stepIndex: item.stepOrder,
            totalSteps: sortedItems.length,
            nextMedicineName: nextMed?.name,
            nextStepGapMinutes: nextGap,
          });
        });
      });

    // Sort by scheduled time
    return doses.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  },
};
