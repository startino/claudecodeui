import { Home, Share2 } from 'lucide-react';

export type RootKey = 'home' | 'shared';

type HomeSharedToggleProps = {
  selected: RootKey;
  onSelect: (key: RootKey, path: string) => void;
  className?: string;
};

const ROOTS: Record<RootKey, { label: string; path: string; Icon: typeof Home }> = {
  home: { label: 'Home', path: '~', Icon: Home },
  shared: { label: 'Shared', path: '/shared', Icon: Share2 },
};

export const detectRootFromPath = (candidatePath: string): RootKey => {
  const normalized = candidatePath.trim();
  if (normalized.startsWith('/shared')) return 'shared';
  if (normalized.startsWith('~') || normalized.startsWith('/home')) return 'home';
  return 'shared';
};

export default function HomeSharedToggle({ selected, onSelect, className = '' }: HomeSharedToggleProps) {
  return (
    <div
      className={`inline-flex rounded-md border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-700 dark:bg-gray-800 ${className}`}
      role="group"
      aria-label="Select base location"
    >
      {(Object.keys(ROOTS) as RootKey[]).map((key) => {
        const { label, path: targetPath, Icon } = ROOTS[key];
        const isActive = selected === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key, targetPath)}
            className={`flex items-center gap-1.5 rounded px-3 py-1 text-xs font-medium transition-colors ${
              isActive
                ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-300'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
            }`}
            aria-pressed={isActive}
            title={`Use ${targetPath}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
