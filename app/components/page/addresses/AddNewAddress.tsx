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

export function AddNewAddress() {
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher({ key: 'address' });
  const loading = fetcher.state !== 'idle';

  const [localForm, setLocalForm] = useState({
    firstName: '',
    lastName: '',
    streetAddress: '',
    streetAddressSecond: '',
    state: '',
    country: '',
    city: '',
    zipCode: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (sessionStorage) {
      const prevAddress = sessionStorage.getItem('addNewAddress')
        ? JSON.parse(sessionStorage.getItem('addNewAddress'))
        : null;
      if (prevAddress) {
        setLocalForm(prevAddress);
      }
    }
  }, []);

  useEffect(() => {
    if (sessionStorage) {
      sessionStorage.setItem('addNewAddress', JSON.stringify(localForm));
    }
  }, [localForm]);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.success) {
      toast.success('Address added successfully');
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
      <DialogTrigger>
        <div className="bg-surface-container hover:bg-surface-container-high grid h-full min-h-[200px] place-items-center rounded-md border border-dashed border-gray-500 text-center font-medium transition">
          Add new address
        </div>
      </DialogTrigger>
      <DialogContent className="minimalist-scrollbar max-h-10/12 overflow-auto border-none">
        <fetcher.Form
          method="POST"
          action="/settings/addresses"
        >
          <DialogHeader>
            <DialogTitle>Add new address</DialogTitle>
            <DialogDescription>
              Save a new address for faster checkout. Use this for a different shipping location, a new billing address,
              or sending a gift.
            </DialogDescription>
          </DialogHeader>
          <input
            type="hidden"
            name="actionType"
            value="add"
          />
          <div className="my-4">
            <div className="mb-4 grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Label htmlFor="first-name">First name*</Label>
                <Input
                  defaultValue={localForm.firstName}
                  id="first-name"
                  name="first-name"
                  disabled={loading}
                  className="bg-surface-container min-w-0 rounded-md px-3 py-2 font-mono focus:outline-none"
                  placeholder="John"
                  onChange={(e) => {
                    setLocalForm((prev) => {
                      return {
                        ...prev,
                        firstName: e.target.value,
                      };
                    });
                  }}
                />
                {fetcher.data?.errors && fetcher.data?.errors.firstName && (
                  <div className="text-red-600">{fetcher.data?.errors.firstName}</div>
                )}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="last-name">Last name*</Label>
                <Input
                  defaultValue={localForm.lastName}
                  id="last-name"
                  name="last-name"
                  disabled={loading}
                  className="bg-surface-container min-w-0 rounded-md px-3 py-2 font-mono focus:outline-none"
                  placeholder="Wick"
                  onChange={(e) => {
                    setLocalForm((prev) => {
                      return {
                        ...prev,
                        lastName: e.target.value,
                      };
                    });
                  }}
                />
                {fetcher.data?.errors && fetcher.data?.errors.lastName && (
                  <div className="text-red-600">{fetcher.data?.errors.lastName}</div>
                )}
              </div>
            </div>
            <div className="mb-4 grid gap-1">
              <Label htmlFor="street-address">Street Address*</Label>
              <Input
                defaultValue={localForm.streetAddress}
                id="street-address"
                name="street-address"
                disabled={loading}
                className="bg-surface-container min-w-0 rounded-md px-3 py-2 font-mono focus:outline-none"
                placeholder="123 Main Street"
                onChange={(e) => {
                  setLocalForm((prev) => {
                    return {
                      ...prev,
                      streetAddress: e.target.value,
                    };
                  });
                }}
              />
              {fetcher.data?.errors && fetcher.data?.errors.streetAddress && (
                <div className="text-red-600">{fetcher.data?.errors.streetAddress}</div>
              )}
            </div>
            <div className="mb-4 grid gap-1">
              <Label htmlFor="street-address-second">Apt, Suite, Building</Label>
              <Input
                defaultValue={localForm.streetAddressSecond}
                id="street-address-second"
                name="street-address-second"
                disabled={loading}
                className="bg-surface-container min-w-0 rounded-md px-3 py-2 font-mono focus:outline-none"
                placeholder="123 Main St, BLDG C, STE 201"
                onChange={(e) => {
                  setLocalForm((prev) => {
                    return {
                      ...prev,
                      streetAddressSecond: e.target.value,
                    };
                  });
                }}
              />
              {fetcher.data?.errors && fetcher.data?.errors.streetSecondAddress && (
                <div className="text-red-600">{fetcher.data?.errors.streetSecondAddress}</div>
              )}
            </div>
            <CountryAndRegion />
            <div className="mb-4 grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Label htmlFor="city">City*</Label>
                <Input
                  defaultValue={localForm.city}
                  id="city"
                  name="city"
                  disabled={loading}
                  className="bg-surface-container min-w-0 rounded-md px-3 py-2 font-mono focus:outline-none"
                  placeholder="New York City"
                  onChange={(e) => {
                    setLocalForm((prev) => {
                      return {
                        ...prev,
                        city: e.target.value,
                      };
                    });
                  }}
                />
                {fetcher.data?.errors && fetcher.data?.errors.city && (
                  <div className="text-red-600">{fetcher.data?.errors.city}</div>
                )}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="zip">Zip*</Label>
                <Input
                  defaultValue={localForm.zipCode}
                  id="zip"
                  name="zip"
                  disabled={loading}
                  className="bg-surface-container min-w-0 rounded-md px-3 py-2 font-mono focus:outline-none"
                  placeholder=""
                  onChange={(e) => {
                    setLocalForm((prev) => {
                      return {
                        ...prev,
                        zipCode: e.target.value,
                      };
                    });
                  }}
                />
                {fetcher.data?.errors && fetcher.data?.errors.zip && (
                  <div className="text-red-600">{fetcher.data?.errors.zip}</div>
                )}
              </div>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="phone-number">Phone number*</Label>
              <Input
                defaultValue={localForm.phoneNumber}
                id="phone-number"
                name="phone-number"
                disabled={loading}
                className="bg-surface-container min-w-0 rounded-md px-3 py-2 font-mono focus:outline-none"
                placeholder="+1 (212) 456-7890"
                onChange={(e) => {
                  setLocalForm((prev) => {
                    return {
                      ...prev,
                      phoneNumber: e.target.value,
                    };
                  });
                }}
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
              className="relative overflow-hidden py-2 transition hover:opacity-90"
            >
              Submit
              {loading && (
                <div className="bg-primary-fixed absolute top-0 left-0 z-10 grid h-full w-full place-items-center py-2.5">
                  <svg
                    aria-hidden="true"
                    className="fill-on-primary aspect-square h-full animate-spin text-transparent"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              )}
            </PrimaryButton>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
