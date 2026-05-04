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

function splitPath(fullPath: string): { prefix: string; leaf: string } {
  const p = fullPath.replace(/^\/home\/[^/]+/, '~');
  const leading = p.startsWith('/') ? '/' : '';
  const parts = p.split('/').filter(Boolean);
  if (parts.length === 0) return { prefix: '', leaf: p };
  const leaf = parts[parts.length - 1];
  if (parts.length === 1) return { prefix: leading, leaf };
  if (parts.length <= 3) {
    const middle = parts.slice(0, -1).join('/');
    return { prefix: `${leading}${middle}/`, leaf };
  }
  const first = parts[0];
  const parent = parts[parts.length - 2];
  return { prefix: `${leading}${first}/.../${parent}/`, leaf };
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
        <div className="flex min-w-0 items-center gap-1.5 font-mono text-[10px] leading-tight text-muted-foreground/70">
          <span
            className="flex min-w-0 flex-1 items-baseline whitespace-nowrap"
            title={session.__projectFullPath}
          >
            {(() => {
              const { prefix, leaf } = splitPath(session.__projectFullPath);
              return (
                <>
                  <span className="truncate [flex-shrink:99999]">{prefix}</span>
                  <span className="min-w-0 truncate">{leaf}</span>
                  <span className="flex-shrink-0 pl-1.5">· {timeAgo}</span>
                </>
              );
            })()}
          </span>
          {isArchived && (
            <span
              className="flex h-3 flex-shrink-0 items-center gap-0.5 rounded-sm bg-muted px-1 text-[9px] font-medium uppercase tracking-wider text-muted-foreground"
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
