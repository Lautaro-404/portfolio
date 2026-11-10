import type { ComponentPropsWithoutRef } from 'react';

type ContainerProps = ComponentPropsWithoutRef<'div'>;

/** Centers content on the shared max width with equal left and right edges. */
export function Container({ className = '', ...rest }: ContainerProps) {
  return <div className={`wrap ${className}`.trim()} {...rest} />;
}
