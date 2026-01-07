import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from 'react-aria-components';
import { cn } from '~/lib/utils';

import { CartFavourite } from './CartFavourite';

export function CartItemCount({
  loading,
  decreaseQuantity,
  increaseQuantity,
  optimisticQuantity,
  variationCode,
  className = '',
}: {
  loading: boolean;
  decreaseQuantity: () => void;
  increaseQuantity: () => void;
  optimisticQuantity: number;
  variationCode: string;
  className?: string;
}) {
  return (
    <div
      className={cn({
        'flex gap-2': true,
        [className]: true,
      })}
    >
      <div className="bg-surface-container-highest flex h-fit items-center rounded-full">
        <Button
          isDisabled={loading}
          onPress={decreaseQuantity}
          className={cn({
            'grid aspect-square w-8 place-items-center rounded-full transition ease-out md:w-10': true,
            'hover:bg-surface-dim': !loading,
          })}
        >
          {optimisticQuantity === 1 && <Trash2 className="stroke-on-surface-variant aspect-square w-3.5 md:w-4.5" />}
          {optimisticQuantity !== 1 && <Minus className="stroke-on-surface-variant aspect-square w-3.5 md:w-4.5" />}
        </Button>
        <div className="mx-2 cursor-default text-sm md:text-base">{optimisticQuantity}</div>
        <Button
          isDisabled={loading}
          onPress={increaseQuantity}
          className={cn({
            'grid aspect-square w-8 place-items-center rounded-full transition ease-out md:w-10': true,
            'hover:bg-surface-dim': !loading,
          })}
        >
          <Plus className="stroke-on-surface-variant aspect-square w-3.5 md:w-4.5" />
        </Button>
      </div>
      <CartFavourite
        className="hidden md:block"
        variationCode={variationCode}
      />
    </div>
  );
}
