/**
 * PillPulse - Google Material 3 Theme Color Configuration
 * Developer: Suhail Akhtar (https://suhail.top)
 */

import { ThemeColor } from '../types';

export interface ThemeColorDefinition {
  id: ThemeColor;
  name: string;
  primary: string; // Light mode accent
  primaryDark: string; // Dark mode accent
  hover: string;
  subtleLight: string;
  subtleDark: string;
  ring: string;
}

export const THEME_COLORS: Record<ThemeColor, ThemeColorDefinition> = {
  blue: {
    id: 'blue',
    name: 'Google Blue',
    primary: '#1A73E8',
    primaryDark: '#8AB4F8',
    hover: '#1557B0',
    subtleLight: '#E8F0FE',
    subtleDark: 'rgba(138, 180, 248, 0.16)',
    ring: 'rgba(26, 115, 232, 0.3)',
  },
  emerald: {
    id: 'emerald',
    name: 'Google Green',
    primary: '#1E8E3E',
    primaryDark: '#81C995',
    hover: '#137333',
    subtleLight: '#E6F4EA',
    subtleDark: 'rgba(129, 201, 149, 0.16)',
    ring: 'rgba(30, 142, 62, 0.3)',
  },
  teal: {
    id: 'teal',
    name: 'Google Teal',
    primary: '#007B83',
    primaryDark: '#78D9EC',
    hover: '#005B60',
    subtleLight: '#E0F2F1',
    subtleDark: 'rgba(120, 217, 236, 0.16)',
    ring: 'rgba(0, 123, 131, 0.3)',
  },
  indigo: {
    id: 'indigo',
    name: 'Google Indigo',
    primary: '#3F51B5',
    primaryDark: '#9FA8DA',
    hover: '#303F9F',
    subtleLight: '#E8EAF6',
    subtleDark: 'rgba(159, 168, 218, 0.16)',
    ring: 'rgba(63, 81, 181, 0.3)',
  },
  purple: {
    id: 'purple',
    name: 'Google Purple',
    primary: '#7C4DFF',
    primaryDark: '#B388FF',
    hover: '#651FFF',
    subtleLight: '#EDE7F6',
    subtleDark: 'rgba(179, 136, 255, 0.16)',
    ring: 'rgba(124, 77, 255, 0.3)',
  },
  orange: {
    id: 'orange',
    name: 'Google Amber',
    primary: '#E37400',
    primaryDark: '#FDD663',
    hover: '#B06000',
    subtleLight: '#FEF7E0',
    subtleDark: 'rgba(253, 214, 99, 0.16)',
    ring: 'rgba(227, 116, 0, 0.3)',
  },
  rose: {
    id: 'rose',
    name: 'Google Red',
    primary: '#D93025',
    primaryDark: '#F28B82',
    hover: '#B31412',
    subtleLight: '#FCE8E6',
    subtleDark: 'rgba(242, 139, 130, 0.16)',
    ring: 'rgba(217, 48, 37, 0.3)',
  },
};

