import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from 'react-aria-components';
import { useLoaderData } from 'react-router';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { cn } from '~/lib/utils';
import type { loader } from '~/routes/settings/addresses';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@ui/Command';

export function CountryCombobox({
  country,
  setCountry,
}: {
  country: string;
  setCountry: (previousState: string) => string;
}) {
  const loaderData = useLoaderData<typeof loader>();
  const countriesAndRegions = loaderData.countriesAndRegions;
  const [open, setOpen] = useState(false);

  return (
    <>
      <input
        type="hidden"
        name="country"
        id="country"
        value={country}
      />
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
            {country
              ? countriesAndRegions.find((item) => item.country.id === country)?.country.name
              : 'Select country...'}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-surface-container w-[var(--radix-popover-trigger-width)] border-none p-0">
          <Command className="bg-surface-container">
            <CommandInput
              placeholder="Search country..."
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countriesAndRegions.map((item) => (
                  <CommandItem
                    key={item.country.id}
                    value={item.country.id}
                    onSelect={(currentValue) => {
                      setCountry(currentValue === country ? '' : currentValue);
                      setOpen(false);
                    }}
                  >
                    {item.country.name}
                    <Check className={cn('ml-auto', country === item.country.id ? 'opacity-100' : 'opacity-0')} />
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
