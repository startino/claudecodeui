import { Quote } from 'lucide-react';

import { CommandItem } from '../../../../shared/view/ui';
import type { TranscriptSessionResult } from '../../hooks/useTranscriptSearch';

type TranscriptMatchRowProps = {
  result: TranscriptSessionResult;
  now: Date;
  onSelect: () => void;
};

function normalizeSnippet(raw: string): string {
  return raw
    .replace(/\.{3,}/g, '…')
    .replace(/…[\s.]*\./g, '…')
    .replace(/\.[\s.]*…/g, '…')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatTimeAgo(timestamp: string | null, now: Date): string | null {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  if (Number.isNaN(diffMs)) return null;
  if (diffMs < 0) return 'now';
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d`;
  const diffMo = Math.floor(diffDay / 30);
  if (diffMo < 12) return `${diffMo}mo`;
  return `${Math.floor(diffDay / 365)}y`;
}

export default function TranscriptMatchRow({ result, now, onSelect }: TranscriptMatchRowProps) {
  const title = result.sessionSummary || result.sessionId;
  const snippet = normalizeSnippet(result.match.snippet);
  const timeAgo = formatTimeAgo(result.match.timestamp, now);

  return (
    <CommandItem
      value={`transcript ${title} ${snippet} ${result.projectDisplayName}`}
      alwaysVisible
      onSelect={onSelect}
      className="flex-col items-stretch gap-0.5"
    >
      <div className="flex min-w-0 items-center gap-2">
        <Quote className="h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden />
        <span className="min-w-0 flex-1 truncate">{title}</span>
        {timeAgo && (
          <span className="flex-shrink-0 text-[11px] text-muted-foreground/70">
            {timeAgo}
          </span>
        )}
        <span className="flex-shrink-0 truncate text-[11px] text-muted-foreground">
          @{result.projectDisplayName}
        </span>
      </div>
      <span className="ml-6 truncate text-xs text-muted-foreground">{snippet}</span>
    </CommandItem>
  );
}
