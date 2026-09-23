/**
 * PillPulse - Skeleton Loaders
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-28 rounded-3xl bg-slate-200/70 dark:bg-slate-800/60" />

      {/* Filter Tabs Skeleton */}
      <div className="flex gap-2">
        <div className="h-8 w-20 rounded-xl bg-slate-200/70 dark:bg-slate-800/60" />
        <div className="h-8 w-20 rounded-xl bg-slate-200/70 dark:bg-slate-800/60" />
        <div className="h-8 w-20 rounded-xl bg-slate-200/70 dark:bg-slate-800/60" />
      </div>

      {/* Dose Items Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-3xl bg-slate-200/60 dark:bg-slate-800/50 p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-300/60 dark:bg-slate-700/60" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-300/60 dark:bg-slate-700/60 rounded" />
                <div className="h-3 w-20 bg-slate-300/60 dark:bg-slate-700/60 rounded" />
              </div>
            </div>
            <div className="h-8 w-16 bg-slate-300/60 dark:bg-slate-700/60 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};
