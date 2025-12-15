import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button, Label } from 'react-aria-components';
import { useLoaderData } from 'react-router';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { cn } from '~/lib/utils';
import type { loader } from '~/routes/settings/addresses';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@ui/Command';

export function StateCombobox({ country, defaultValue = '' }: { country: string; defaultValue?: string }) {
  const loaderData = useLoaderData<typeof loader>();
  const countriesAndRegions = loaderData.countriesAndRegions;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [isFirst, setIsFirstRender] = useState(true);

  const regions = countriesAndRegions.find((item) => item.country.id === country)?.regions ?? [];
  let type;
  if (regions.length > 0) {
    type = regions[0].type;
  }

  useEffect(() => {
    if (!isFirst) {
      setValue('');
    }
    setIsFirstRender(false);
  }, [country]);

  return (
    <>
      <input
        type="hidden"
        name="state"
        id="state"
        value={value}
      />
      <Label htmlFor="state">{type ?? 'State'}*</Label>
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            aria-role="combobox"
            aria-expanded={open}
            className="bg-surface-container flex w-full justify-between rounded-md px-3 py-2 focus:outline-none"
          >
            {value
              ? regions.find((region) => region.id === value)?.name
              : `Select ${(type ?? 'state').toLowerCase()}...`}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-surface-container w-[var(--radix-popover-trigger-width)] border-none p-0">
          <Command className="bg-surface-container">
            <CommandInput
              placeholder={`Search ${(type ?? 'state').toLowerCase()}...`}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No {(type ?? 'state').toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {regions.map((region) => (
                  <CommandItem
                    key={region.name}
                    value={region.id}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }}
                  >
                    {region.name}
                    <Check className={cn('ml-auto', value === region.id ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
