import { Search } from 'lucide-react';
import { Button, Input, type InputProps } from 'react-aria-components';

import { cn } from '@libs/cn';

export function GlobalSearchInput(properties: InputProps) {
  const { className, ...rest } = properties;

  return (
    <label
      className="relative z-0 block w-full max-w-[240px]"
      htmlFor="header-search"
    >
      <Input
        {...rest}
        id="header-search"
        placeholder="Search..."
        className={cn(
          'bg-surface-container-high text-on-surface w-full rounded-xl px-4 py-3 text-sm focus:outline-none',
          className
        )}
      />
    </label>
  );
}
