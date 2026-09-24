/**
 * PillPulse - Application Footer
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React from 'react';

interface FooterProps {
  onOpenChangelog: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenChangelog }) => {
  return (
    <footer className="mt-auto py-6 px-4 sm:px-6 border-t border-slate-200/60 dark:border-slate-800/60 text-center text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          Created by{' '}
          <a
            href="https://suhail.top"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-teal-600 dark:text-teal-400 hover:underline"
          >
            Suhail Akhtar
          </a>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenChangelog}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[11px] transition-colors"
            title="View Release Changelog"
          >
            <span>v1.5.2</span>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-sans font-medium">What's New</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
