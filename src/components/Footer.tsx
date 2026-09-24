/**
 * PillPulse - Google Health Footer
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import React from 'react';

interface FooterProps {
  onOpenChangelog: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenChangelog }) => {
  return (
    <footer className="mt-auto py-6 px-4 sm:px-6 border-t border-[#E0E3E7] dark:border-[#3C4043] text-center text-xs text-[#444746] dark:text-[#9AA0A6] bg-[#FFFFFF] dark:bg-[#1E1F20] transition-colors">
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Mandatory Developer Attribution */}
        <div className="flex items-center gap-2">
          {/* Subtle Google 4-color mini dots */}
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC04]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
          </div>
          <span>
            Created by{' '}
            <a
              href="https://suhail.top"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline text-[#1F1F1F] dark:text-[#E3E3E3]"
              style={{ color: 'var(--app-accent, #1A73E8)' }}
            >
              Suhail Akhtar
            </a>
          </span>
        </div>

        {/* SemVer Version UI Display & Changelog Modal Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenChangelog}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F4F9] dark:bg-[#282A2C] hover:bg-[#E0E3E7] dark:hover:bg-[#3C4043] text-[#444746] dark:text-[#9AA0A6] hover:text-[#1F1F1F] dark:hover:text-[#E3E3E3] font-mono text-[11px] transition-colors cursor-pointer"
            title="View Release Changelog"
          >
            <span className="font-medium text-[#1F1F1F] dark:text-[#E3E3E3]">v1.6.0</span>
            <span
              className="text-[10px] font-sans font-medium px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: 'var(--app-accent-subtle, #E8F0FE)',
                color: 'var(--app-accent, #1A73E8)',
              }}
            >
              What's New
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};
