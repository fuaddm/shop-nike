import { Search } from 'lucide-react';
import { Button, Input, type InputProps } from 'react-aria-components';

import { cn } from '@libs/cn';

export function SearchInput(properties: InputProps) {
  const { className, ...rest } = properties;

  return (
    <label
      className="relative z-0 block w-full max-w-full md:max-w-[240px]"
      htmlFor="search"
    >
      <Input
        {...rest}
        id="search"
        placeholder="Search..."
        className={cn(
          'bg-surface-container text-on-surface w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none',
          className
        )}
      />
    </label>
  );
}
