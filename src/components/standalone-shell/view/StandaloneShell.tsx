import { useCallback, useState } from 'react';
import type { Project, ProjectSession } from '../../../types/app';
import Shell from '../../shell/view/Shell';
import StandaloneShellHeader from './subcomponents/StandaloneShellHeader';

const SHARED_DEFAULT_PROJECT: Project = {
  name: 'shared-default',
  displayName: 'Shared',
  path: '/shared',
  fullPath: '/shared',
} as Project;

type StandaloneShellProps = {
  project?: Project | null;
  session?: ProjectSession | null;
  command?: string | null;
  isPlainShell?: boolean | null;
  isActive?: boolean;
  autoConnect?: boolean;
  onComplete?: ((exitCode: number) => void) | null;
  onClose?: (() => void) | null;
  title?: string | null;
  className?: string;
  showHeader?: boolean;
  compact?: boolean;
  minimal?: boolean;
};

export default function StandaloneShell({
  project = null,
  session = null,
  command = null,
  isPlainShell = null,
  isActive = true,
  autoConnect = true,
  onComplete = null,
  onClose = null,
  title = null,
  className = '',
  showHeader = true,
  compact = false,
  minimal = false,
}: StandaloneShellProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  // Keep `compact` in the public API for compatibility with existing callers.
  void compact;

  // Fall back to a plain shell at /shared when no project is selected.
  const effectiveProject = project ?? SHARED_DEFAULT_PROJECT;
  const hasRealProject = project !== null;
  const shouldUsePlainShell =
    !hasRealProject || (isPlainShell !== null ? isPlainShell : command !== null);

  const handleProcessComplete = useCallback(
    (exitCode: number) => {
      setIsCompleted(true);
      onComplete?.(exitCode);
    },
    [onComplete],
  );

  return (
    <div className={`flex h-full w-full flex-col ${className}`}>
      {!minimal && showHeader && title && (
        <StandaloneShellHeader title={title} isCompleted={isCompleted} onClose={onClose} />
      )}

      <div className="min-h-0 w-full flex-1">
        <Shell
          selectedProject={effectiveProject}
          selectedSession={hasRealProject ? session : null}
          initialCommand={hasRealProject ? command : null}
          isPlainShell={shouldUsePlainShell}
          isActive={isActive}
          onProcessComplete={handleProcessComplete}
          minimal={minimal}
          autoConnect={minimal ? true : autoConnect}
        />
      </div>
    </div>
  );
}
