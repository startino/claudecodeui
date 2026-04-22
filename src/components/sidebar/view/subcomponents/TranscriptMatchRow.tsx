import type { KeyboardEvent } from 'react';
import { Quote } from 'lucide-react';

import { cn } from '../../../../lib/utils';
import type { TranscriptSessionResult } from '../../hooks/useTranscriptSearch';

/**
 * Row renderer for transcript match results inside the command palette.
 *
 * This is a raw <div>, *not* a CommandItem. The Command root filters
 * CommandItem children by visibleIds (synchronous substring match against
 * the typed query), which would hide transcript rows whenever the query
 * doesn't literally appear in the row's searchable text — defeating the
 * purpose. Rendering outside the CommandItem system bypasses that filter.
 *
 * Tradeoff (accepted for MVP): transcript rows are not in the Command
 * arrow-key traversal. They stay reachable via click and focus+Enter/Space.
 * A follow-up will extend Command.tsx with an external-item registration
 * API if keyboard parity is wanted.
 */

type TranscriptMatchRowProps = {
  result: TranscriptSessionResult;
  onSelect: () => void;
};

export default function TranscriptMatchRow({ result, onSelect }: TranscriptMatchRowProps) {
  const title = result.sessionSummary || result.sessionId;
  const snippet = result.match.snippet;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="option"
      aria-selected={false}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative flex cursor-pointer select-none flex-col gap-0.5 rounded-sm px-2 py-1.5 text-sm outline-none',
        'hover:bg-accent focus-visible:bg-accent',
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Quote className="h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden />
        <span className="min-w-0 flex-1 truncate">{title}</span>
        <span className="flex-shrink-0 truncate text-[11px] text-muted-foreground">
          @{result.projectDisplayName}
        </span>
      </div>
      <span className="ml-6 truncate text-xs text-muted-foreground">{snippet}</span>
    </div>
  );
}
