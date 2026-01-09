import { BadgePercent, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Checkbox } from 'react-aria-components';
import { Link, useFetcher } from 'react-router';
import { toast } from 'sonner';

import { cn } from '@libs/cn';

import { CartItemCount } from './CartItemCount';

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
  isDiscountApplied?: boolean;
  discountedPrice?: number | null;
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
  isDiscountApplied = false,
  isSelected = true,
  discountedPrice = null,
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
        'bg-surface-container relative rounded-md p-3': true,
        'animate-pulse opacity-50': loading,
      })}
    >
      <div className="flex gap-2 md:gap-3">
        <Checkbox
          defaultSelected={isSelected}
          onChange={() => {
            toggleIsSelected();
          }}
          className="bg-surface-container group border-outline-variant h-5 w-5 min-w-5 overflow-hidden rounded-md border md:h-6 md:w-6 md:min-w-6"
        >
          <div className="border-outline group-data-selected:bg-surface-tint group-data-selected:border-surface-tint grid h-full w-full place-items-center p-0.75 transition">
            <Check className="stroke-surface-bright h-full w-full opacity-0 transition group-data-selected:opacity-100" />
          </div>
        </Checkbox>
        <div>
          <Link
            to={`/product/${variationCode}`}
            className="bg-surface-dim relative mb-2 block aspect-square w-18 overflow-hidden rounded-md md:w-34"
          >
            <img
              src={img}
              className="h-full w-full object-cover"
              alt=""
            />
          </Link>
          <CartItemCount
            loading={loading}
            decreaseQuantity={decreaseQuantity}
            increaseQuantity={increaseQuantity}
            optimisticQuantity={optimisticQuantity}
            variationCode={variationCode}
            className="hidden md:flex"
          />
        </div>
        <div className="w-full">
          <div className="flex items-start justify-between gap-3 md:mt-1.5">
            <div>
              <Link
                to={`/product/${variationCode}`}
                className="text-sm font-medium md:text-base"
              >
                {name}
              </Link>
              {isDiscountApplied && (
                <div className="mt-1 flex w-fit items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs text-green-800 md:hidden">
                  <BadgePercent className="h-3.5 w-3.5" />
                  Discount
                </div>
              )}
              <div className="hidden md:block">
                <div className="text-on-surface-variant text-sm md:text-base">{category}</div>
                <div className="text-on-surface-variant text-sm md:text-base">{color}</div>
                <div className="text-on-surface-variant text-sm md:text-base">Size {size}</div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <CartItemCount
                loading={loading}
                decreaseQuantity={decreaseQuantity}
                increaseQuantity={increaseQuantity}
                optimisticQuantity={optimisticQuantity}
                variationCode={variationCode}
                className="flex md:hidden"
              />
              {discountedPrice === Number(price) && (
                <div className="flex items-start gap-0.5">
                  <span className="text-sm font-medium">$</span>
                  <span className="font-semibold">{price}</span>
                </div>
              )}
              {discountedPrice !== Number(price) && (
                <div className="flex flex-col items-end">
                  <div className="text-on-surface-variant flex items-start gap-0.5 line-through">
                    <span className="text-xs">$</span>
                    <span className="text-sm font-medium">{price}</span>
                  </div>
                  <div className="flex items-start gap-0.5">
                    <span className="text-sm font-medium">$</span>
                    <span className="font-semibold">{discountedPrice}</span>
                  </div>
                </div>
              )}
              {isDiscountApplied && (
                <div className="hidden items-center gap-1 rounded-full bg-green-50 py-1 ps-2 pe-3 text-xs text-green-800 md:flex md:text-sm">
                  <BadgePercent className="h-5 w-5" />
                  Discount applied
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-1 grid grid-cols-3 divide-x md:hidden">
        <div className="text-on-surface-variant w-full text-center text-sm md:text-base">{category}</div>
        <div className="text-on-surface-variant w-full text-center text-sm md:text-base">{color}</div>
        <div className="text-on-surface-variant w-full text-center text-sm md:text-base">Size {size}</div>
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
  discountedPrice = null,
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
            {discountedPrice && discountedPrice !== Number(price) && (
              <div>
                <div className="text-on-surface-variant text-sm">Subtotal:</div>
                <div className="flex items-start gap-0.5">
                  <span className="text-sm font-medium">$</span>
                  <span className="font-semibold">{discountedPrice}</span>
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
