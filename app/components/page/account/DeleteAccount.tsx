import { useEffect, useState } from 'react';
import { Button, Input } from 'react-aria-components';
import { useFetcher, useLoaderData } from 'react-router';
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

import { cn } from '@libs/cn';

export function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const fetcher = useFetcher({ key: 'address' });
  const loading = fetcher.state !== 'idle';

  const loaderData = useLoaderData();
  const { userData } = loaderData;
  const email = userData?.data?.email;

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
        <div className="border-outline-variant rounded-full border px-4 py-0.5 transition ease-out hover:border-red-500 hover:bg-red-500 hover:text-white">
          Delete
        </div>
      </DialogTrigger>
      <DialogContent className="minimalist-scrollbar max-h-10/12 overflow-auto border-none">
        <fetcher.Form
          method="POST"
          action="/settings/delete-my-profile"
          onSubmit={(e) => {
            if (e.target?.email.value !== email) {
              e.preventDefault();
              setError(true);
            } else {
              setError(false);
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Permanently Delete Account?</DialogTitle>
            <DialogDescription>Warning: This action is irreversible</DialogDescription>
          </DialogHeader>
          <input
            type="hidden"
            name="actionType"
            value="add"
          />
          <div className="my-4">
            <div className="grid gap-1">
              <Input
                name="email"
                disabled={loading}
                onChange={(e) => {
                  if (e.target.value !== email) {
                    setError(false);
                  }
                }}
                className={cn({
                  'bg-surface-container border-surface-container min-w-0 rounded-md border px-3 py-2 font-mono outline-none': true,
                  'border border-red-500': error,
                })}
                placeholder="Enter your email address"
              />
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
              className="py-2 font-semibold transition hover:opacity-90"
            >
              Yes, delete
            </PrimaryButton>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
