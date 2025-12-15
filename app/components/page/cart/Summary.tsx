import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button, Input } from 'react-aria-components';
import { Link, useFetcher, useLoaderData, useNavigation, useSearchParams } from 'react-router';
import { toast } from 'sonner';

import { cn } from '@libs/cn';

export function Summary() {
  const loaderData = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const updateItemQuantityFetcher = useFetcher({ key: 'update-item-quantity' });

  const [promocodeValue, setPromocodeValue] = useState('');
  const [promocodeValidError, setPromocodeValidError] = useState(false);

  const loading = navigation.state !== 'idle' || fetcher.state !== 'idle' || updateItemQuantityFetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.state === 'idle') {
      if (fetcher.data?.success === true) {
        const params = new URLSearchParams();
        params.set('promocode', fetcher.data?.promocode);
        setSearchParams(params, {
          preventScrollReset: true,
        });
      } else {
        if (fetcher.data?.errorMsg) {
          setPromocodeValidError(true);
          toast.error(fetcher.data.errorMsg);
        }
      }
    }
  }, [fetcher]);

  return (
    <div className="bg-surface-container h-fit rounded-md px-5 py-4">
      <div className="mb-6 text-3xl font-medium">Summary</div>
      <div className="text-on-surface-variant mb-2 flex justify-between px-2">
        <div>Subtotal</div>
        <div className="font-medium">${loaderData.data.subtotal}</div>
      </div>
      <div className="text-on-surface-variant mb-2 flex justify-between px-2">
        <div>Shipping</div>
        <div className="font-medium">FREE</div>
      </div>
      <div className="text-on-surface-variant mb-4 flex justify-between px-2">
        <div>Discount</div>
        <div className="font-medium">${loaderData.data.discountAmount}</div>
      </div>
      <div className="border-outline-variant text-on-surface mb-4 flex justify-between border-y py-3 text-lg font-medium">
        <div>Total</div>
        <div className="font-medium">${loaderData.data.totalPrice}</div>
      </div>
      <fetcher.Form
        method="POST"
        className="mb-3 flex gap-3"
        onSubmit={(e) => {
          if (promocodeValue.length === 0) {
            e.preventDefault();
            setPromocodeValidError(true);
          }
        }}
      >
        <input
          type="hidden"
          name="actionName"
          value="promocode"
        />
        <Input
          name="promocode"
          value={promocodeValue}
          onChange={(e) => {
            if (e.target.value.length <= 6) {
              setPromocodeValue(e.target.value);
              setPromocodeValidError(false);
            }
          }}
          className={cn({
            'bg-surface-bright w-full rounded-lg px-4 outline-2 outline-transparent transition ease-out': true,
            'outline-error outline-2': promocodeValidError,
          })}
          placeholder="Promocode"
        />
        <Button
          type="submit"
          isDisabled={loading}
          className="border-outline-variant not-disabled:hover:bg-surface-bright rounded-xl border px-6 py-3 transition ease-out outline-none disabled:opacity-60"
        >
          Apply
        </Button>
      </fetcher.Form>
      {searchParams.get('promocode') && (
        <div
          className={cn({
            'bg-tertiary-container text-on-tertiary-container mb-3 flex items-center justify-between rounded-lg px-3 py-4': true,
            'opacity-60': loading,
          })}
        >
          {searchParams.get('promocode')}
          <Button
            onPress={() => setSearchParams()}
            className="hover:bg-on-tertiary-container/10 rounded-md p-1 transition ease-out"
          >
            <X />
          </Button>
        </div>
      )}
      {loaderData.data.promoCodeError && <div className="text-error mb-3">{loaderData.data.promoCodeError}</div>}
      <Link
        to={searchParams.get('promocode') ? `/checkout?promocode=${searchParams.get('promocode')}` : '/checkout'}
        className={cn({
          'bg-primary text-on-primary block w-full rounded-xl py-3.5 text-center transition ease-out hover:opacity-80': true,
          'pointer-events-none opacity-60': loading,
        })}
      >
        Checkout
      </Link>
    </div>
  );
}
export function SimpleSummary() {
  const loaderData = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === 'idle') {
      if (fetcher.data?.success === true) {
        const params = new URLSearchParams();
        params.set('promocode', fetcher.data?.promocode);
        setSearchParams(params, {
          preventScrollReset: true,
        });
      } else {
        if (fetcher.data?.errorMsg) toast.error(fetcher.data.errorMsg);
      }
    }
  }, [fetcher]);

  return (
    <div className="bg-surface-container h-fit rounded-md px-5 py-4">
      <div className="mb-6 text-3xl font-medium">In Your Bag</div>
      <div className="text-on-surface-variant mb-2 flex justify-between px-2">
        <div>Subtotal</div>
        <div className="font-medium">${loaderData.data.subtotal}</div>
      </div>
      <div className="text-on-surface-variant mb-2 flex justify-between px-2">
        <div>Shipping</div>
        <div className="font-medium">FREE</div>
      </div>
      <div className="text-on-surface-variant mb-4 flex justify-between px-2">
        <div>Discount</div>
        <div className="font-medium">${loaderData.data.discountAmount}</div>
      </div>
      <div className="border-outline-variant text-on-surface flex justify-between border-t px-2 py-3 text-lg font-medium">
        <div>Total</div>
        <div className="font-medium">${loaderData.data.totalPrice}</div>
      </div>
      {loaderData.data.promoCodeError && <div className="text-error mb-3">{loaderData.data.promoCodeError}</div>}
    </div>
  );
}
