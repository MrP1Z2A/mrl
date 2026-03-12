import React from 'react';
import {
  Grid2x2,
  Volume2,
  Wifi,
  Building2,
  House,
  Crosshair,
  Wrench,
  Sun,
  Bot,
  Gamepad2,
  Lightbulb,
  Monitor,
  Watch,
} from 'lucide-react';
import { CATEGORY_STRIP_ITEMS } from '../categories';

const iconByLabel = {
  'All categories': Grid2x2,
  'Audio and sound': Volume2,
  'Internet of things': Wifi,
  Installations: Building2,
  'Home automation': House,
  'Flying things': Crosshair,
  'Lab tools': Wrench,
  Environment: Sun,
  Robotics: Bot,
  'Interactive games': Gamepad2,
  'Smart lighting': Lightbulb,
  Displays: Monitor,
  Wearables: Watch,
} as const;

export const CategoryStrip: React.FC = () => {
  return (
    <section className="mb-4 border-y border-slate-200 bg-white/80 px-2 py-3 overflow-x-auto">
      <div className="flex items-start gap-4 min-w-max">
        {CATEGORY_STRIP_ITEMS.map((label) => {
          const Icon = iconByLabel[label];
          const active = label === 'All categories';
          return (
            <button
              key={label}
              className={`flex w-[108px] flex-col items-center gap-2 pb-3 text-center transition-colors ${
                active
                  ? 'border-b-2 border-[#0f8b95] text-[#0f8b95]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs font-medium leading-tight">{label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
