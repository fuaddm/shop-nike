import { useEffect, useState } from 'react';
import { Button, Input, Label } from 'react-aria-components';
import { useFetcher } from 'react-router';
import { toast } from 'sonner';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/Dialog';
import { PrimaryButton } from '@ui/button/PrimaryButton';

import { CountryAndRegion } from '@components/page/addresses/CountryAndRegion';

export function EditAddress({ data }: { data: unknown }) {
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher({ key: 'edit-address' });
  const loading = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.success) {
      toast.success('Card added successfully');
      setOpen(false);
    } else if (fetcher.state === 'idle' && fetcher.data?.success === false) {
      toast.error('Something went wrong. Please try again');
    }
  }, [fetcher]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className="hover:bg-surface-container w-full rounded px-2 py-1.5 text-start text-sm">Edit</Button>
      </DialogTrigger>
      <DialogContent className="minimalist-scrollbar max-h-10/12 overflow-auto border-none">
        <fetcher.Form method="POST">
          <DialogHeader>
            <DialogTitle>Edit address</DialogTitle>
            <DialogDescription>
              Save the address for faster checkout. Use this for a different shipping location, a new billing address,
              or sending a gift.
            </DialogDescription>
          </DialogHeader>
          <input
            type="hidden"
            name="actionType"
            value="edit"
          />
          <input
            type="hidden"
            name="addressId"
            value={data.addressId}
          />
          <div className="my-4">
            <div className="mb-4 grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Label htmlFor="first-name">First name*</Label>
                <Input
                  id="first-name"
                  name="first-name"
                  defaultValue={data.firstName}
                  disabled={loading}
                  className="bg-surface-container min-w-0 rounded-md px-3 py-2 font-mono focus:outline-none"
                  placeholder="John"
                />
                {fetcher.data?.errors && fetcher.data?.errors.firstName && (
                  <div className="text-red-600">{fetcher.data?.errors.firstName}</div>
                )}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="last-name">Last name*</Label>
                <Input
                  id="last-name"
                  name="last-name"
                  defaultValue={data.lastName}
                  disabled={loading}
                  className="bg-surface-container min-w-0 rounded-md px-3 py-2 font-mono focus:outline-none"
                  placeholder="Wick"
                />
                {fetcher.data?.errors && fetcher.data?.errors.lastName && (
                  <div className="text-red-600">{fetcher.data?.errors.lastName}</div>
                )}
              </div>
            </div>
            <div className="mb-4 grid gap-1">
              <Label htmlFor="street-address">Street Address*</Label>
              <Input
                id="street-address"
                name="street-address"
                defaultValue={data.streetAddress}
                disabled={loading}
                className="bg-surface-container min-w-0 rounded-md px-3 py-2 font-mono focus:outline-none"
                placeholder="123 Main Street"
              />
              {fetcher.data?.errors && fetcher.data?.errors.streetAddress && (
                <div className="text-red-600">{fetcher.data?.errors.streetAddress}</div>
              )}
            </div>
            <div className="mb-4 grid gap-1">
              <Label htmlFor="street-address-second">Apt, Suite, Building</Label>
              <Input
                id="street-address-second"
                name="street-address-second"
                defaultValue={data.streetAddressSecond}
                disabled={loading}
                className="bg-surface-container min-w-0 rounded-md px-3 py-2 font-mono focus:outline-none"
                placeholder="123 Main St, BLDG C, STE 201"
              />
              {fetcher.data?.errors && fetcher.data?.errors.streetSecondAddress && (
                <div className="text-red-600">{fetcher.data?.errors.streetSecondAddress}</div>
              )}
            </div>
            <CountryAndRegion
              state={data.locationId}
              propCountry={data.countryId}
            />
            <div className="mb-4 grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Label htmlFor="city">City*</Label>
                <Input
                  id="city"
                  name="city"
                  defaultValue={data.city}
                  disabled={loading}
                  className="bg-surface-container min-w-0 rounded-md px-3 py-2 font-mono focus:outline-none"
                  placeholder="New York City"
                />
                {fetcher.data?.errors && fetcher.data?.errors.city && (
                  <div className="text-red-600">{fetcher.data?.errors.city}</div>
                )}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="zip">Zip*</Label>
                <Input
                  id="zip"
                  name="zip"
                  defaultValue={data.zipCode}
                  disabled={loading}
                  className="bg-surface-container min-w-0 rounded-md px-3 py-2 font-mono focus:outline-none"
                  placeholder=""
                />
                {fetcher.data?.errors && fetcher.data?.errors.zip && (
                  <div className="text-red-600">{fetcher.data?.errors.zip}</div>
                )}
              </div>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="phone-number">Phone number*</Label>
              <Input
                id="phone-number"
                name="phone-number"
                defaultValue={data.phoneNumber}
                disabled={loading}
                className="bg-surface-container min-w-0 rounded-md px-3 py-2 font-mono focus:outline-none"
                placeholder="+1 (212) 456-7890"
              />
              {fetcher.data?.errors && fetcher.data?.errors.phoneNumber && (
                <div className="text-red-600">{fetcher.data?.errors.phoneNumber}</div>
              )}
            </div>
          </div>
          <DialogFooter className="flex gap-1 md:gap-4">
            <DialogClose asChild>
              <Button
                type="button"
                className="hover:bg-surface-container rounded-xl px-6 py-2 transition"
              >
                Cancel
              </Button>
            </DialogClose>
            <PrimaryButton
              type="submit"
              isDisabled={loading}
              className="py-2 transition hover:opacity-90"
            >
              Edit
            </PrimaryButton>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
