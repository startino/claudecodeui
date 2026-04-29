/**
 * Per-session metadata captured at submit time that is not echoed back by the
 * provider — currently just the reasoning effort the user picked. The
 * realtime handler reads this when an assistant message arrives so the UI can
 * label the message with the effort it ran under. Lives in memory only:
 * after a reload the JSONL has no record of effort, so the badge disappears.
 */

const PENDING_KEY = '__pending__';
const lastSubmittedEffort = new Map<string, string>();

export function setLastSubmittedEffort(sessionId: string | null | undefined, effort: string | null | undefined): void {
  const key = sessionId || PENDING_KEY;
  if (effort) {
    lastSubmittedEffort.set(key, effort);
  } else {
    lastSubmittedEffort.delete(key);
  }
}

export function getLastSubmittedEffort(sessionId: string | null | undefined): string | undefined {
  if (sessionId) {
    const direct = lastSubmittedEffort.get(sessionId);
    if (direct) return direct;
  }
  return lastSubmittedEffort.get(PENDING_KEY);
}

/** When a new session id is assigned, move pending effort under that id. */
export function adoptPendingEffortForSession(sessionId: string): void {
  const pending = lastSubmittedEffort.get(PENDING_KEY);
  if (!pending) return;
  lastSubmittedEffort.set(sessionId, pending);
  lastSubmittedEffort.delete(PENDING_KEY);
}
