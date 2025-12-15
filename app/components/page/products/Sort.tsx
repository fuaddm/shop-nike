import { ChevronDown } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { Button, ListBox, ListBoxItem, Popover, Select, SelectValue } from 'react-aria-components';

export function Sort() {
  const [value, setValue] = useQueryState('SortId', {
    defaultValue: '1',
  });

  return (
    <Select
      aria-label="sort"
      className="group"
      name="sort"
      defaultSelectedKey={value ?? '1'}
      onSelectionChange={(key) => setValue(key)}
    >
      <Button className="bg-surface-container hover:bg-surface-container-low flex items-center gap-4 rounded-lg px-4 py-2 transition ease-out data-focused:outline-none">
        <SelectValue />
        <span aria-hidden="true">
          <ChevronDown className="transition group-data-open:-rotate-180" />
        </span>
      </Button>
      <Popover className="bg-surface-container data-placement-top w-[var(--trigger-width)] rounded-lg py-1 opacity-100 transition data-entering:-translate-y-0.5 data-entering:opacity-0 data-exiting:-translate-y-0.5 data-exiting:opacity-0 data-focused:outline-none">
        <ListBox className="data-focused:outline-none">
          <ListBoxItem
            id="1"
            className="hover:bg-surface-container-low cursor-pointer px-3 py-1.5 text-sm transition outline-none data-focused:outline-none"
          >
            Newest Arrivals
          </ListBoxItem>
          <ListBoxItem
            id="2"
            className="hover:bg-surface-container-low cursor-pointer px-3 py-1.5 text-sm transition outline-none data-focused:outline-none"
          >
            Price: High to Low
          </ListBoxItem>
          <ListBoxItem
            id="3"
            className="hover:bg-surface-container-low cursor-pointer px-3 py-1.5 text-sm transition outline-none data-focused:outline-none"
          >
            Price: Low to High
          </ListBoxItem>
        </ListBox>
      </Popover>
    </Select>
  );
}
