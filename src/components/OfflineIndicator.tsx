/**
 * PillPulse - Offline Network Indicator
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-40 flex items-center gap-2.5 rounded-2xl bg-slate-900 text-white p-3 shadow-xl border border-slate-700 text-xs">
      <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
        <WifiOff className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-100">Offline Mode Active</p>
        <p className="text-[11px] text-slate-400 truncate">Alarms & local routines continue running offline.</p>
      </div>
    </div>
  );
};
