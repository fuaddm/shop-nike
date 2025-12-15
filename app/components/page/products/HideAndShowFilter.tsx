import { SlidersHorizontal } from 'lucide-react';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { Button } from 'react-aria-components';

export function HideAndShowFilter() {
  const [isOpen, setIsOpen] = useQueryState('VisibilityOfFilter', parseAsBoolean.withDefault(true));

  return (
    <Button
      onPress={() => setIsOpen((previous) => !previous)}
      className="bg-surface-container hover:bg-surface-container-low flex h-fit items-center gap-2 rounded-lg px-4 py-2 transition ease-out data-focused:outline-none"
    >
      {isOpen ? 'Hide' : 'Show'} Filters
      <SlidersHorizontal className="h-4 w-4" />
    </Button>
  );
}
