import { Button, type ButtonProps } from 'react-aria-components';

import { cn } from '@libs/cn';

export function PrimaryButton(properties: ButtonProps) {
  const { className, children, ...rest } = properties;

  return (
    <Button
      {...rest}
      className={cn('bg-primary text-on-primary rounded-xl px-6 py-3', className)}
    >
      {children}
    </Button>
  );
}
