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

export function AddNewCard() {
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
        <div className="bg-surface-container hover:bg-surface-container-high grid aspect-[1.586/1] place-items-center rounded-md border border-dashed border-gray-500 text-center font-medium transition">
          Add new card
        </div>
      </DialogTrigger>
      <DialogContent className="border-none">
        <fetcher.Form method="POST">
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
              className="py-2 transition hover:opacity-90"
            >
              Submit
            </PrimaryButton>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
