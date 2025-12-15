import { Button } from 'react-aria-components';

import { useMenuStore } from '@stores/menuStore';

import { cn } from '@libs/cn';

export function Burger() {
  const isOpen = useMenuStore((state) => state.isOpen);
  const setIsOpen = useMenuStore((state) => state.setIsOpen);

  return (
    <Button
      onPress={() => setIsOpen((previous: boolean) => !previous)}
      className="box-content flex h-5 w-fit flex-col justify-center gap-1 overflow-hidden p-4 ps-0"
    >
      <div
        className={cn({
          'bg-on-surface-variant h-[2px] w-5 origin-bottom-left rounded-full transition': true,
          'w-[16px] rotate-45': isOpen,
        })}
      ></div>
      <div
        className={cn({
          'bg-on-surface-variant h-[2px] w-5 rounded-full opacity-100': true,
          'opacity-0': isOpen,
        })}
      ></div>
      <div
        className={cn({
          'bg-on-surface-variant h-[2px] w-5 origin-top-left rounded-full transition': true,
          'w-[16px] -rotate-45': isOpen,
        })}
      ></div>
    </Button>
  );
}
