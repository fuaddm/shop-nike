import { Check, Minus, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button, Checkbox } from 'react-aria-components';
import { Link, useFetcher } from 'react-router';
import { toast } from 'sonner';

import { CartFavourite } from '@components/page/cart/CartFavourite';

import { cn } from '@libs/cn';

interface ICardProperties {
  id: string;
  name: string;
  color: string;
  category: string;
  size: string;
  price: string;
  subtotal?: string;
  img: string;
  variationCode: string;
  quantity: number;
  isSelected?: boolean;
}

export function CartItem({
  id,
  name,
  color,
  category,
  size,
  price,
  img,
  variationCode,
  quantity,
  isSelected = true,
}: ICardProperties) {
  const fetcher = useFetcher({ key: 'update-item-quantity' });
  const [optimisticQuantity, setOptimisticQuantity] = useState(quantity);

  function increaseQuantity() {
    const formData = new FormData();
    formData.append('actionName', 'update-item-quantity');
    formData.append('cartItemId', id);
    formData.append('quantity', String(optimisticQuantity + 1));
    setOptimisticQuantity((prev) => prev + 1);

    fetcher.submit(formData, {
      method: 'post',
    });
  }

  function toggleIsSelected() {
    const formData = new FormData();
    formData.append('actionName', 'toggle-is-selected');
    formData.append('cartItemId', id);

    fetcher.submit(formData, {
      method: 'post',
    });
  }

  function decreaseQuantity() {
    if (optimisticQuantity > 0) {
      const formData = new FormData();
      formData.append('actionName', 'update-item-quantity');
      formData.append('cartItemId', id);
      formData.append('quantity', String(optimisticQuantity - 1));
      setOptimisticQuantity((prev) => prev - 1);

      fetcher.submit(formData, {
        method: 'post',
      });
    }
  }

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data && fetcher.data.success === false) {
      toast.error('Please try again later.');
      setOptimisticQuantity(quantity);
    }
  }, [fetcher]);

  useEffect(() => {
    setOptimisticQuantity(quantity);
  }, [quantity]);

  const loading = fetcher.state !== 'idle' && optimisticQuantity === 0;

  return (
    <div
      className={cn({
        'bg-surface-container relative flex gap-3 rounded-md p-3': true,
        'animate-pulse opacity-50': loading,
      })}
    >
      <Checkbox
        defaultSelected={isSelected}
        onChange={() => {
          toggleIsSelected();
        }}
        className="bg-surface-container group border-outline-variant h-6 w-6 min-w-6 overflow-hidden rounded-md border"
      >
        <div className="border-outline group-data-selected:bg-surface-tint group-data-selected:border-surface-tint grid h-full w-full place-items-center p-0.75 transition">
          <Check className="stroke-surface-bright h-full w-full opacity-0 transition group-data-selected:opacity-100" />
        </div>
      </Checkbox>
      <div>
        <div className="bg-surface-dim relative mb-2 aspect-square w-34 overflow-hidden rounded-md">
          <img
            src={img}
            className="h-full w-full object-cover"
            alt=""
          />
        </div>
        <div className="flex gap-2">
          <div className="bg-surface-container-highest flex items-center rounded-full">
            <Button
              isDisabled={loading}
              onPress={decreaseQuantity}
              className={cn({
                'grid aspect-square w-10 place-items-center rounded-full transition ease-out': true,
                'hover:bg-surface-dim': !loading,
              })}
            >
              {optimisticQuantity === 1 && (
                <Trash2
                  className="stroke-on-surface-variant"
                  size={18}
                />
              )}
              {optimisticQuantity !== 1 && (
                <Minus
                  className="stroke-on-surface-variant"
                  size={18}
                />
              )}
            </Button>
            <div className="mx-2 cursor-default">{optimisticQuantity}</div>
            <Button
              isDisabled={loading}
              onPress={increaseQuantity}
              className={cn({
                'grid aspect-square w-10 place-items-center rounded-full transition ease-out': true,
                'hover:bg-surface-dim': !loading,
              })}
            >
              <Plus
                className="stroke-on-surface-variant"
                size={18}
              />
            </Button>
          </div>
          <CartFavourite variationCode={variationCode} />
        </div>
      </div>
      <div className="w-full">
        <div className="mt-1.5 flex items-start justify-between">
          <Link
            to={`/product/${variationCode}`}
            className="font-medium"
          >
            {name}
          </Link>
          <div className="flex items-start gap-0.5">
            <span className="text-sm font-medium">$</span>
            <span className="font-semibold">{price}</span>
          </div>
        </div>
        <div className="text-on-surface-variant">{category}</div>
        <div className="text-on-surface-variant">{color}</div>
        <div className="text-on-surface-variant">Size {size}</div>
      </div>
    </div>
  );
}

export function SimpleCartItem({
  name,
  color,
  category,
  size,
  price,
  subtotal = '',
  img,
  quantity,
  variationCode,
}: ICardProperties) {
  return (
    <div className="bg-surface-container flex gap-3 rounded-md p-3">
      <div>
        <div className="bg-surface-dim mb-2 aspect-square w-34 overflow-hidden rounded-md">
          <img
            src={img}
            className="h-full w-full object-cover"
            alt=""
          />
        </div>
        <div className="bg-surface-container-highest flex h-fit w-fit items-center rounded-full px-4 py-2">
          Quantity: {quantity}
        </div>
      </div>
      <div className="w-full">
        <div className="mt-1.5 flex items-start justify-between">
          <Link
            to={`/product/${variationCode}`}
            className="font-medium"
          >
            {name}
          </Link>
          <div>
            <div>
              <div className="text-on-surface-variant text-sm">Total:</div>
              <div className="flex items-start gap-0.5">
                <span className="text-sm font-medium">$</span>
                <span className="font-semibold">{price}</span>
              </div>
            </div>
            {subtotal && subtotal !== price && (
              <div>
                <div className="text-on-surface-variant text-sm">Subtotal:</div>
                <div className="flex items-start gap-0.5">
                  <span className="text-sm font-medium">$</span>
                  <span className="font-semibold">{subtotal}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="text-on-surface-variant">{category}</div>
        <div className="text-on-surface-variant">{color}</div>
        <div className="text-on-surface-variant">Size {size}</div>
      </div>
    </div>
  );
}
