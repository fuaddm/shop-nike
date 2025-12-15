import { Button, type ButtonProps } from 'react-aria-components';

import { cn } from '@libs/cn';

export function OutlineButton(properties: ButtonProps) {
  const { className, children, ...rest } = properties;

  return (
    <Button
      {...rest}
      className={cn('text-on-surface border-outline-variant rounded-xl border bg-transparent px-6 py-3', className)}
    >
      {children}
    </Button>
  );
}
