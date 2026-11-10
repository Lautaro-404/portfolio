import type { ComponentPropsWithoutRef } from 'react';

type Variant = 'primary' | 'secondary';

type ButtonProps = {
  variant?: Variant;
} & (
  | ({ href: string } & ComponentPropsWithoutRef<'a'>)
  | ({ href?: undefined } & ComponentPropsWithoutRef<'button'>)
);

const VARIANT_CLASS: Record<Variant, string> = {
  primary: 'btn-tech-primary',
  secondary: 'btn-tech-secondary',
};

/** Renders an anchor when `href` is given, otherwise a button. */
export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const classes = `${VARIANT_CLASS[variant]} ${className}`.trim();

  if (props.href !== undefined) {
    const anchorProps = props as ComponentPropsWithoutRef<'a'>;
    return <a {...anchorProps} className={classes} />;
  }

  const buttonProps = props as ComponentPropsWithoutRef<'button'>;
  return <button type="button" {...buttonProps} className={classes} />;
}
