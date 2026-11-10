import type { ComponentPropsWithoutRef } from 'react';

type BadgeProps = ComponentPropsWithoutRef<'span'>;

/** Small bordered label used for technologies and status chips. */
export function Badge({ className = '', ...rest }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1 font-mono text-xs text-[var(--text-primary)] ${className}`.trim()}
      {...rest}
    />
  );
}
