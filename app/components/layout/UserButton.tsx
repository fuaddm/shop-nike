import { UserIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from 'react-aria-components';
import { Link, useFetcher, useLoaderData } from 'react-router';
import { toast } from 'sonner';
import type { loader } from '~/root';

import { cn } from '@libs/cn';

export function UserButton() {
  const loaderData = useLoaderData<typeof loader>();
  const isAuth = loaderData.user?.isAuth;

  const userData = loaderData.user?.userData;
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data?.success === true && fetcher.state === 'idle') toast.success('Logged out successfully.');
  }, [fetcher]);

  if (isAuth) {
    return (
      <div className="bg-surface-bright group relative grid place-content-center rounded-full p-3">
        <UserIcon className="stroke-on-surface-variant aspect-square w-6" />
        <div
          className={cn({
            'absolute top-full -right-3 z-100 p-3': true,
            'invisible -translate-y-1 opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100': true,
          })}
        >
          <div className="bg-surface-container flex flex-col rounded-lg p-1 text-center">
            <Link
              to="/settings"
              className="hover:bg-surface-bright text-primary cursor-pointer rounded-md px-4 py-1.5 transition"
            >
              {userData?.data?.email}
            </Link>
            <Link
              to="/settings/payment"
              className="hover:bg-surface-bright rounded-md px-4 py-1.5 transition"
            >
              Payment Details
            </Link>
            <Link
              to="/settings/orders"
              className="hover:bg-surface-bright rounded-md px-4 py-1.5 transition"
            >
              My Orders
            </Link>
            <Link
              to="/settings/addresses"
              className="hover:bg-surface-bright rounded-md px-4 py-1.5 transition"
            >
              Addresses
            </Link>
            <Button
              onPress={() =>
                fetcher.submit(null, {
                  action: '/logout',
                  method: 'post',
                })
              }
              className="hover:bg-surface-bright w-full rounded-md px-4 py-1.5 text-red-500 transition"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
