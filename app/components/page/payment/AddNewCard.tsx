import { useEffect, useState } from 'react';
import { Button, Input, Label } from 'react-aria-components';
import { useFetcher } from 'react-router';
import { toast } from 'sonner';
import { withMask } from 'use-mask-input';

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

import { cn } from '@libs/cn';

export function AddNewCard({ isCheckout = false }: { isCheckout?: boolean }) {
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher();
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
      <DialogTrigger>
        <div
          className={cn({
            'bg-surface-container hover:bg-surface-container-high grid aspect-[1.586/1] place-items-center rounded-md border border-dashed border-gray-500 text-center font-medium transition': true,
            'aspect-[1.586/1]': !isCheckout,
            'h-18 w-full': isCheckout,
          })}
        >
          Add new card
        </div>
      </DialogTrigger>
      <DialogContent className="border-none">
        <fetcher.Form
          method="POST"
          action="/settings/payment"
        >
          <DialogHeader>
            <DialogTitle>Add new card</DialogTitle>
            <DialogDescription>
              Add a new credit or debit card to your account for faster checkout and easy payments.
            </DialogDescription>
          </DialogHeader>
          <input
            type="hidden"
            name="actionType"
            value="add"
          />
          <div className="my-4">
            <div className="mb-4 grid gap-1">
              <Label htmlFor="card-number">Card number</Label>
              <Input
                id="card-number"
                name="card-number"
                disabled={loading}
                className="bg-surface-container rounded-md px-3 py-2 font-mono focus:outline-none"
                placeholder="____-____-____-____"
                ref={withMask('9999-9999-9999-9999')}
                autoComplete="cc-number"
              />
              {fetcher.data?.errors && fetcher.data?.errors.cardNumber && (
                <div className="text-red-600">{fetcher.data?.errors.cardNumber}</div>
              )}
            </div>
            <div className="mb-4 grid gap-1">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                name="full-name"
                disabled={loading}
                autoComplete="cc-name"
                className="bg-surface-container rounded-md px-3 py-2 font-mono focus:outline-none"
              />
              {fetcher.data?.errors && fetcher.data?.errors.cardHolderName && (
                <div className="text-red-600">{fetcher.data?.errors.cardHolderName}</div>
              )}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="expiration-date">Date</Label>
              <Input
                id="expiration-date"
                disabled={loading}
                name="expiration-date"
                className="bg-surface-container rounded-md px-3 py-2 font-mono focus:outline-none"
                ref={withMask('99/99')}
                autoComplete="cc-exp"
                placeholder="__-__"
              />
              {fetcher.data?.errors && fetcher.data?.errors.expirationDate && (
                <div className="text-red-600">{fetcher.data?.errors.expirationDate}</div>
              )}
            </div>
          </div>
          <DialogFooter className="flex gap-4">
            <DialogClose asChild>
              <Button
                type="button"
                className="hover:bg-surface-container rounded-xl px-6 transition"
              >
                Cancel
              </Button>
            </DialogClose>
            <PrimaryButton
              type="submit"
              isDisabled={loading}
              className="relative overflow-hidden py-2 transition not-disabled:hover:opacity-90"
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
