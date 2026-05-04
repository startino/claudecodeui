import React, { useState } from 'react';
import { Archive, ArchiveRestore } from 'lucide-react';
import type { FlatSession } from '../../../../hooks/useFlatSessionList';

type FlatSessionItemProps = {
  session: FlatSession;
  isSelected: boolean;
  isArchived: boolean;
  index: number;
  timeAgo: string;
  displayName: string;
  onSelect: (e: React.MouseEvent) => void;
  onToggleArchived: () => void;
  showHotkey?: boolean;
};

function prunePath(fullPath: string): string {
  const p = fullPath.replace(/^\/home\/[^/]+/, '~');
  const leading = p.startsWith('/') ? '/' : '';
  const parts = p.split('/').filter(Boolean);
  if (parts.length === 0) return p;
  if (parts.length <= 3) return p;
  return `${leading}${parts[0]}/.../${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
}

const STATUS_TINT_BG: Record<FlatSession['__status'], string | null> = {
  running: 'hsl(var(--status-running) / 0.10)',
  waiting: 'hsl(var(--status-waiting) / 0.12)',
  error: 'hsl(var(--status-error) / 0.12)',
  idle: null,
  done: null,
};

export default function FlatSessionItem({
  session,
  isSelected,
  isArchived,
  index,
  timeAgo,
  displayName,
  onSelect,
  onToggleArchived,
  showHotkey = false,
}: FlatSessionItemProps) {
  const [hover, setHover] = useState(false);
  const isAttention = session.__status === 'waiting' || session.__status === 'error';
  const statusTint = STATUS_TINT_BG[session.__status];

  const useTokenBg = isSelected || hover;
  const tokenBgClass = isSelected ? 'bg-accent' : hover ? 'bg-accent/50' : '';

  return (
    <button
      onClick={(e) => onSelect(e)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`flex w-full items-center gap-2 rounded-md border-l-2 px-2 py-2 text-left transition-colors ${tokenBgClass} ${
        isArchived ? 'opacity-55' : ''
      }`}
      style={{
        borderLeftColor: isSelected ? 'var(--project-accent)' : 'transparent',
        backgroundColor: !useTokenBg && statusTint ? statusTint : undefined,
      }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 truncate font-mono text-[10px] leading-tight text-muted-foreground/70">
          <span className="truncate" title={session.__projectFullPath}>
            {prunePath(session.__projectFullPath)} · {timeAgo}
          </span>
          {isArchived && (
            <span
              className="flex h-3 items-center gap-0.5 rounded-sm bg-muted px-1 text-[9px] font-medium uppercase tracking-wider text-muted-foreground"
              title="Archived — kept on disk, only visible via search"
            >
              <Archive className="h-2.5 w-2.5" />
              archived
            </span>
          )}
        </div>
        <div
          className={`truncate text-[13px] leading-tight ${
            isAttention || isSelected
              ? 'font-medium text-foreground'
              : 'text-muted-foreground'
          }`}
        >
          {displayName}
        </div>
      </div>

      {hover && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onToggleArchived();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              e.preventDefault();
              onToggleArchived();
            }
          }}
          className="flex flex-shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
          title={
            isArchived
              ? 'Unarchive'
              : 'Archive (kept on disk, findable via search)'
          }
        >
          {isArchived ? (
            <ArchiveRestore className="h-3 w-3" />
          ) : (
            <Archive className="h-3 w-3" />
          )}
        </span>
      )}

      {showHotkey && !hover && index < 8 && (
        <span className="flex-shrink-0 font-mono text-[9px] text-muted-foreground/50">
          ⌘{index + 1}
        </span>
      )}
    </button>
  );
}
