/**
 * PillPulse - Minimal Medicine & Routine Reminder
 * Developer: Suhail Akhtar (https://suhail.top)
 * Created by Suhail Akhtar
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BottomNav, NavTab } from './components/BottomNav';
import { ToastContainer } from './components/ToastContainer';
import { ConfirmModal } from './components/ConfirmModal';
import { WhatIsNewModal } from './components/WhatIsNewModal';
import { ActiveAlarmModal } from './components/ActiveAlarmModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SkeletonLoader } from './components/SkeletonLoader';

import { TodayView } from './features/today/TodayView';
import { RoutineManagerView } from './features/routines/RoutineManagerView';
import { QuickRoutineModal } from './features/routines/QuickRoutineModal';
import { MedicineListView } from './features/medicines/MedicineListView';
import { AddMedicineModal } from './features/medicines/AddMedicineModal';
import { AdherenceView } from './features/history/AdherenceView';
import { SettingsModal } from './features/settings/SettingsModal';

import { storageService } from './services/storageService';
import { audioService } from './services/audioService';
import { notificationService } from './services/notificationService';
import { useToast } from './hooks/useToast';
import {
  Medicine,
  Routine,
  ScheduledDose,
  NotificationSettings,
  DoseHistoryLog,
  TimeSlot,
} from './types';
import {
  getTodayDateString,
  triggerDoseCelebration,
  isToday,
  addMinutesToTime,
  formatTime12h,
} from './utils';

export default function App() {
  const todayStr = getTodayDateString();
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const { toasts, addToast, removeToast } = useToast();

  // Primary State
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [doses, setDoses] = useState<ScheduledDose[]>([]);
  const [history, setHistory] = useState<DoseHistoryLog[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(storageService.getSettings());
  const [isLoading, setIsLoading] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<NavTab>('today');

  // Modals
  const [isQuickRoutineOpen, setIsQuickRoutineOpen] = useState(false);
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  // Confirmation Modal state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Active Alarm & Cascading Step Countdown
  const [activeAlarmDose, setActiveAlarmDose] = useState<ScheduledDose | null>(null);
  const [isAlarmMuted, setIsAlarmMuted] = useState(false);
  const [activeStepCountdown, setActiveStepCountdown] = useState<{
    targetDose: ScheduledDose;
    remainingSeconds: number;
    totalSeconds: number;
  } | null>(null);

  // Track fired alarm IDs so we don't spam every second
  const firedAlarmsRef = useRef<Set<string>>(new Set());

  // Load initial data on mount
  useEffect(() => {
    try {
      const loadedMeds = storageService.getMedicines();
      const loadedRoutines = storageService.getRoutines();
      const loadedDoses = storageService.getDosesForDate(selectedDate);
      const loadedHist = storageService.getHistory();
      const loadedSettings = storageService.getSettings();

      setMedicines(loadedMeds);
      setRoutines(loadedRoutines);
      setDoses(loadedDoses);
      setHistory(loadedHist);
      setSettings(loadedSettings);
    } catch (e) {
      console.error('Failed to load initial data:', e);
    } finally {
      setTimeout(() => setIsLoading(false), 250);
    }
  }, []);

  // When selectedDate changes, load doses for that specific date!
  useEffect(() => {
    const dateDoses = storageService.getDosesForDate(selectedDate);
    setDoses(dateDoses);
  }, [selectedDate]);

  // Main Ticking Engine: Checks time & handles 5-minute countdown timers (Only on today)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMins = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMins}`;

      // 1. Check cascading routine active countdown
      if (activeStepCountdown) {
        if (activeStepCountdown.remainingSeconds <= 1) {
          const target = activeStepCountdown.targetDose;
          setActiveStepCountdown(null);
          triggerAlarm(target);
          addToast(
            `5-min gap finished! Time for Step ${target.stepIndex}: ${target.medicineName}`,
            'info',
            'Cascading Routine Step'
          );
        } else {
          setActiveStepCountdown((prev) =>
            prev ? { ...prev, remainingSeconds: prev.remainingSeconds - 1 } : null
          );
        }
      }

      // 2. Check scheduled doses matching current minute (only for today)
      if (isToday(selectedDate)) {
        doses.forEach((dose) => {
          if (
            dose.status === 'pending' &&
            dose.scheduledTime === currentTimeStr &&
            !firedAlarmsRef.current.has(dose.id)
          ) {
            firedAlarmsRef.current.add(dose.id);
            triggerAlarm(dose);
          }
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [doses, activeStepCountdown, settings, selectedDate]);

  // Trigger Sound, Notification & Active Modal
  const triggerAlarm = useCallback((dose: ScheduledDose) => {
    setActiveAlarmDose(dose);
    setIsAlarmMuted(false);

    if (settings.soundEnabled) {
      audioService.playAlarm(settings.soundPreset, settings.soundVolume, settings.soundRepeat);
    }

    if (settings.browserNotifications) {
      notificationService.showNotification(`Time for ${dose.medicineName} (${dose.dosage})`, {
        body: dose.instructions || 'Tap to mark as taken or snooze.',
        tag: dose.id,
      });
    }
  }, [settings]);

  // Test Sound
  const handleTestSound = () => {
    audioService.playAlarm(settings.soundPreset, settings.soundVolume, 1);
    addToast(`Playing '${settings.soundPreset}' alarm sound preview.`, 'info');
  };

  // Mark Dose as Taken: Works anytime, even while 5-min gap timer is counting down!
  const handleTakeDose = (dose: ScheduledDose) => {
    const takenTime = new Date().toISOString();

    // Update dose status for selected date
    const updatedDoses = doses.map((d) =>
      d.id === dose.id ? { ...d, status: 'taken' as const, takenAt: takenTime } : d
    );
    setDoses(updatedDoses);
    storageService.saveDosesForDate(selectedDate, updatedDoses);

    // Close alarm modal if currently open for this dose
    if (activeAlarmDose?.id === dose.id) {
      setActiveAlarmDose(null);
    }

    // Decrement medicine inventory if tracked
    const updatedMeds = medicines.map((m) => {
      if (m.id === dose.medicineId && m.inventoryCount !== undefined) {
        const nextCount = Math.max(0, m.inventoryCount - 1);
        if (m.lowStockThreshold && nextCount <= m.lowStockThreshold) {
          addToast(
            `Only ${nextCount} pills left for ${m.name}. Time to refill!`,
            'warning',
            'Low Stock Alert'
          );
        }
        return { ...m, inventoryCount: nextCount };
      }
      return m;
    });
    setMedicines(updatedMeds);
    storageService.saveMedicines(updatedMeds);

    // Add to history log
    const newLog: DoseHistoryLog = {
      id: `log-${Date.now()}`,
      doseId: dose.id,
      medicineName: dose.medicineName,
      dosage: dose.dosage,
      scheduledTime: dose.scheduledTime,
      takenAt: takenTime,
      status: 'taken',
      routineName: dose.routineName,
    };
    const updatedHistory = [newLog, ...history];
    setHistory(updatedHistory);
    storageService.saveHistory(updatedHistory);

    // Celebratory feedback!
    triggerDoseCelebration();

    // CASCADING ROUTINE AUTOMATION:
    // If we took the target of an active countdown, clear the countdown!
    if (activeStepCountdown?.targetDose.id === dose.id) {
      setActiveStepCountdown(null);
    }

    // If this dose is part of a routine sequence, look for the next pending step!
    if (dose.routineId && dose.stepIndex && dose.totalSteps && isToday(selectedDate)) {
      const nextStepDose = updatedDoses.find(
        (d) =>
          d.routineId === dose.routineId &&
          d.stepIndex === (dose.stepIndex || 0) + 1 &&
          d.status === 'pending'
      );

      if (nextStepDose) {
        const gap = nextStepDose.nextStepGapMinutes !== undefined ? nextStepDose.nextStepGapMinutes : 5;
        if (gap === 0) {
          // No gap required: next step is ready immediately at the same time!
          setActiveStepCountdown(null);
          addToast(
            `Marked taken! Step ${nextStepDose.stepIndex} (${nextStepDose.medicineName}) is ready now (no gap required / take together).`,
            'info',
            'Take Together'
          );
        } else {
          // Custom gap countdown (e.g. 5m, 10m, 15m, 30m)
          const totalSecs = gap * 60;
          setActiveStepCountdown({
            targetDose: nextStepDose,
            remainingSeconds: totalSecs,
            totalSeconds: totalSecs,
          });
          addToast(
            `Marked taken! Next up: Step ${nextStepDose.stepIndex} (${nextStepDose.medicineName}) in ${gap} minutes (or take anytime).`,
            'info',
            'Cascading Sequence'
          );
        }
      } else {
        // All steps in this routine are now taken!
        setActiveStepCountdown(null);
        addToast(`${dose.medicineName} taken! Entire routine sequence completed!`, 'success');
      }
    } else {
      addToast(`${dose.medicineName} marked as taken!`, 'success');
    }
  };

  // Undo Dose: Reverts dose back to pending
  const handleUndoDose = (dose: ScheduledDose) => {
    const updatedDoses = doses.map((d) =>
      d.id === dose.id ? { ...d, status: 'pending' as const, takenAt: undefined } : d
    );
    setDoses(updatedDoses);
    storageService.saveDosesForDate(selectedDate, updatedDoses);

    // Re-increment inventory if tracked
    const updatedMeds = medicines.map((m) => {
      if (m.id === dose.medicineId && m.inventoryCount !== undefined) {
        return { ...m, inventoryCount: m.inventoryCount + 1 };
      }
      return m;
    });
    setMedicines(updatedMeds);
    storageService.saveMedicines(updatedMeds);

    // Remove from history
    const updatedHistory = history.filter((h) => h.doseId !== dose.id);
    setHistory(updatedHistory);
    storageService.saveHistory(updatedHistory);

    addToast(`Reverted ${dose.medicineName} to pending.`, 'info');
  };

  // Mark Entire Routine Stack as Taken at once
  const handleTakeEntireRoutine = (routineId: string) => {
    const takenTime = new Date().toISOString();
    const updatedDoses = doses.map((d) => {
      if (d.routineId === routineId && d.status === 'pending') {
        return { ...d, status: 'taken' as const, takenAt: takenTime };
      }
      return d;
    });
    setDoses(updatedDoses);
    storageService.saveDosesForDate(selectedDate, updatedDoses);

    // Clear active countdown if for this routine
    if (activeStepCountdown?.targetDose.routineId === routineId) {
      setActiveStepCountdown(null);
    }

    triggerDoseCelebration();
    addToast('Marked all medicines in routine stack as taken!', 'success');
  };

  // Snooze Dose
  const handleSnoozeDose = (dose: ScheduledDose, minutes = 5) => {
    const updatedDoses = doses.map((d) =>
      d.id === dose.id ? { ...d, status: 'snoozed' as const } : d
    );
    setDoses(updatedDoses);
    storageService.saveDosesForDate(selectedDate, updatedDoses);

    if (activeAlarmDose?.id === dose.id) {
      setActiveAlarmDose(null);
    }

    addToast(`Snoozed ${dose.medicineName} for ${minutes} minutes.`, 'info');

    setTimeout(() => {
      triggerAlarm(dose);
    }, minutes * 60 * 1000);
  };

  // Skip Dose
  const handleSkipDose = (dose: ScheduledDose) => {
    const updatedDoses = doses.map((d) =>
      d.id === dose.id ? { ...d, status: 'skipped' as const } : d
    );
    setDoses(updatedDoses);
    storageService.saveDosesForDate(selectedDate, updatedDoses);

    if (activeAlarmDose?.id === dose.id) {
      setActiveAlarmDose(null);
    }

    if (activeStepCountdown?.targetDose.id === dose.id) {
      setActiveStepCountdown(null);
    }

    addToast(`Skipped dose for ${dose.medicineName}.`, 'warning');
  };

  // Quick Routine Creation with Individual Medicine Gaps
  const handleCreateQuickRoutine = (payload: {
    routineName: string;
    slots: { slot: TimeSlot; time: string }[];
    medicines: {
      name: string;
      dosage: string;
      instructions: string;
      gapFromPrevious: number;
    }[];
  }) => {
    const newMedicines: Medicine[] = [...medicines];
    const createdMedIds: string[] = [];

    payload.medicines.forEach((medInput, idx) => {
      const existing = newMedicines.find(
        (m) => m.name.toLowerCase() === medInput.name.toLowerCase()
      );
      if (existing) {
        createdMedIds.push(existing.id);
      } else {
        const newMed: Medicine = {
          id: `med-${Date.now()}-${idx}`,
          name: medInput.name,
          dosage: medInput.dosage,
          instructions: medInput.instructions,
          shape: 'capsule',
          color: (['teal', 'sky', 'indigo', 'amber', 'emerald', 'coral', 'purple'][idx % 7] as any),
          inventoryCount: 30,
          lowStockThreshold: 7,
          createdAt: new Date().toISOString(),
        };
        newMedicines.push(newMed);
        createdMedIds.push(newMed.id);
      }
    });

    setMedicines(newMedicines);
    storageService.saveMedicines(newMedicines);

    const newRoutines: Routine[] = [...routines];
    payload.slots.forEach((slotConfig, slotIdx) => {
      const routineId = `routine-${Date.now()}-${slotIdx}`;

      // Calculate cumulative offsets from each medicine's individual gapFromPrevious
      let currentOffset = 0;
      const routineItems = createdMedIds.map((medId, stepIdx) => {
        const medInput = payload.medicines[stepIdx];
        const gap = stepIdx === 0 ? 0 : (medInput.gapFromPrevious ?? 5);
        currentOffset += gap;
        return {
          medicineId: medId,
          stepOrder: stepIdx + 1,
          offsetMinutes: currentOffset,
          gapFromPrevious: gap,
          notes:
            gap === 0 && stepIdx > 0
              ? `Take together with Step ${stepIdx} (0m gap)`
              : gap > 0
              ? `Take ${gap}m after Step ${stepIdx}`
              : medInput.instructions || undefined,
        };
      });

      const maxInterval = Math.max(...payload.medicines.map((m) => m.gapFromPrevious || 0));

      const newRoutine: Routine = {
        id: routineId,
        name:
          payload.slots.length > 1
            ? `${payload.routineName} (${slotConfig.slot})`
            : payload.routineName,
        slot: slotConfig.slot,
        startTime: slotConfig.time,
        intervalMinutes: maxInterval || 0,
        active: true,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        createdAt: new Date().toISOString(),
        items: routineItems,
      };

      newRoutines.push(newRoutine);
    });

    setRoutines(newRoutines);
    storageService.saveRoutines(newRoutines);

    // Regenerate doses for selectedDate
    const refreshedDoses = storageService.generateDosesForDate(selectedDate);
    setDoses(refreshedDoses);
    storageService.saveDosesForDate(selectedDate, refreshedDoses);

    const hasNoGap = payload.medicines.some((m, idx) => idx > 0 && m.gapFromPrevious === 0);
    const hasCustomGap = payload.medicines.some((m, idx) => idx > 0 && m.gapFromPrevious !== 5);

    addToast(
      `Created routine with ${hasNoGap ? 'combo (0m gap) / ' : ''}${hasCustomGap ? 'custom intervals' : '5m gaps'} across ${payload.slots.length} time slot(s)!`,
      'success'
    );
    setActiveTab('today');
  };

  // Add or Edit Medicine
  const handleSaveMedicine = (medData: Partial<Medicine>) => {
    let updated: Medicine[];
    if (editingMedicine) {
      updated = medicines.map((m) =>
        m.id === medData.id ? ({ ...m, ...medData } as Medicine) : m
      );
      addToast(`Updated ${medData.name}.`, 'success');
    } else {
      const newMed = {
        ...medData,
        createdAt: new Date().toISOString(),
      } as Medicine;
      updated = [newMed, ...medicines];
      addToast(`Added ${medData.name} to cabinet.`, 'success');
    }
    setMedicines(updated);
    storageService.saveMedicines(updated);
    setEditingMedicine(null);
  };

  // Delete Medicine
  const handleDeleteMedicine = (id: string) => {
    const med = medicines.find((m) => m.id === id);
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Medicine',
      message: `Are you sure you want to remove ${med?.name || 'this medicine'} from your cabinet?`,
      confirmLabel: 'Delete',
      isDestructive: true,
      onConfirm: () => {
        const next = medicines.filter((m) => m.id !== id);
        setMedicines(next);
        storageService.saveMedicines(next);
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        addToast(`Removed medicine from cabinet.`, 'info');
      },
    });
  };

  // Routine Management
  const handleToggleRoutineActive = (id: string, active: boolean) => {
    const updated = routines.map((r) => (r.id === id ? { ...r, active } : r));
    setRoutines(updated);
    storageService.saveRoutines(updated);

    const refreshed = storageService.generateDosesForDate(selectedDate);
    setDoses(refreshed);
    storageService.saveDosesForDate(selectedDate, refreshed);

    addToast(`Routine ${active ? 'activated' : 'paused'}.`, 'info');
  };

  const handleDeleteRoutine = (id: string) => {
    const routine = routines.find((r) => r.id === id);
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Routine',
      message: `Are you sure you want to remove the routine "${routine?.name}"?`,
      confirmLabel: 'Delete',
      isDestructive: true,
      onConfirm: () => {
        const updated = routines.filter((r) => r.id !== id);
        setRoutines(updated);
        storageService.saveRoutines(updated);

        const refreshed = storageService.generateDosesForDate(selectedDate);
        setDoses(refreshed);
        storageService.saveDosesForDate(selectedDate, refreshed);

        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        addToast(`Deleted routine.`, 'info');
      },
    });
  };

  // Change Start Time of a Routine
  const handleUpdateRoutineStartTime = (routineId: string, newStartTime: string) => {
    const targetRoutine = routines.find((r) => r.id === routineId);
    if (!targetRoutine) return;

    const updatedRoutines = routines.map((r) =>
      r.id === routineId ? { ...r, startTime: newStartTime } : r
    );
    setRoutines(updatedRoutines);
    storageService.saveRoutines(updatedRoutines);

    // Update scheduled doses for this routine on current selected date if pending
    const updatedDoses = doses.map((d) => {
      if (d.routineId === routineId && d.status === 'pending') {
        const item = targetRoutine.items.find((i) => i.medicineId === d.medicineId);
        const offset = item ? item.offsetMinutes : 0;
        return {
          ...d,
          scheduledTime: addMinutesToTime(newStartTime, offset),
        };
      }
      return d;
    });
    setDoses(updatedDoses);
    storageService.saveDosesForDate(selectedDate, updatedDoses);

    addToast(`Start time updated to ${formatTime12h(newStartTime)} for ${targetRoutine.name}.`, 'success');
  };

  // Reschedule / Change Time of an Individual Dose
  const handleUpdateDoseTime = (doseId: string, newTime: string) => {
    const updatedDoses = doses.map((d) =>
      d.id === doseId ? { ...d, scheduledTime: newTime } : d
    );
    setDoses(updatedDoses);
    storageService.saveDosesForDate(selectedDate, updatedDoses);
    addToast(`Dose rescheduled to ${formatTime12h(newTime)}.`, 'success');
  };

  // Reset All Data
  const handleResetData = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Reset All Data',
      message:
        'This will reset all medications, routines, and dose logs back to initial factory demo state.',
      confirmLabel: 'Reset Everything',
      isDestructive: true,
      onConfirm: () => {
        localStorage.clear();
        const initialMeds = storageService.getMedicines();
        const initialRoutines = storageService.getRoutines();
        const initialDoses = storageService.generateDosesForDate(selectedDate);
        setMedicines(initialMeds);
        setRoutines(initialRoutines);
        setDoses(initialDoses);
        setHistory([]);
        setActiveStepCountdown(null);
        setActiveAlarmDose(null);
        setIsSettingsOpen(false);
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        addToast('Application data has been reset to defaults.', 'info');
      },
    });
  };

  const pendingDosesCount = doses.filter((d) => d.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Toast System */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Offline Status */}
      <OfflineIndicator />

      {/* Top Navbar */}
      <Navbar
        onTestSound={handleTestSound}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenQuickRoutine={() => setIsQuickRoutineOpen(true)}
        activeAlarmCount={activeAlarmDose ? 1 : 0}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 pt-4 pb-28 sm:pb-32">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <>
            {activeTab === 'today' && (
              <TodayView
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                doses={doses}
                activeStepCountdown={activeStepCountdown}
                onTakeDose={handleTakeDose}
                onUndoDose={handleUndoDose}
                onTakeEntireRoutine={handleTakeEntireRoutine}
                onSnoozeDose={handleSnoozeDose}
                onSkipDose={handleSkipDose}
                onTriggerAlarmNow={triggerAlarm}
                onDismissCountdown={() => setActiveStepCountdown(null)}
                onOpenQuickRoutine={() => setIsQuickRoutineOpen(true)}
                onUpdateDoseTime={handleUpdateDoseTime}
              />
            )}

            {activeTab === 'routines' && (
              <RoutineManagerView
                routines={routines}
                medicines={medicines}
                onOpenQuickRoutine={() => setIsQuickRoutineOpen(true)}
                onToggleActive={handleToggleRoutineActive}
                onDeleteRoutine={handleDeleteRoutine}
                onUpdateStartTime={handleUpdateRoutineStartTime}
              />
            )}

            {activeTab === 'medicines' && (
              <MedicineListView
                medicines={medicines}
                onAddMedicine={() => {
                  setEditingMedicine(null);
                  setIsAddMedicineOpen(true);
                }}
                onEditMedicine={(med) => {
                  setEditingMedicine(med);
                  setIsAddMedicineOpen(true);
                }}
                onDeleteMedicine={handleDeleteMedicine}
              />
            )}

            {activeTab === 'adherence' && (
              <AdherenceView
                history={history}
                todayDoses={doses}
                onSelectDate={(dateStr) => {
                  setSelectedDate(dateStr);
                  setActiveTab('today');
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenQuickRoutine={() => setIsQuickRoutineOpen(true)}
        pendingCount={pendingDosesCount}
      />

      {/* Mandatory Attribution Footer */}
      <Footer onOpenChangelog={() => setIsChangelogOpen(true)} />

      {/* Modals */}
      <ActiveAlarmModal
        dose={activeAlarmDose}
        onTake={handleTakeDose}
        onSnooze={handleSnoozeDose}
        onSkip={handleSkipDose}
        onMuteToggle={() => setIsAlarmMuted((prev) => !prev)}
        isMuted={isAlarmMuted}
      />

      <QuickRoutineModal
        isOpen={isQuickRoutineOpen}
        onClose={() => setIsQuickRoutineOpen(false)}
        onCreate={handleCreateQuickRoutine}
      />

      <AddMedicineModal
        isOpen={isAddMedicineOpen}
        onClose={() => {
          setIsAddMedicineOpen(false);
          setEditingMedicine(null);
        }}
        onSave={handleSaveMedicine}
        editingMedicine={editingMedicine}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) => {
          setSettings(newSettings);
          storageService.saveSettings(newSettings);
        }}
        onResetData={handleResetData}
      />

      <WhatIsNewModal
        isOpen={isChangelogOpen}
        onClose={() => setIsChangelogOpen(false)}
      />

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel={confirmConfig.confirmLabel}
        isDestructive={confirmConfig.isDestructive}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
