import { CreditCard, Map, ShoppingBasket, User } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router';

import { cn } from '@libs/cn';

export default function Layout() {
  const location = useLocation();
  const pathnames = location.pathname.split('/');
  const activePathname = pathnames.at(-1);

  return (
    <div className="container pt-12">
      <div className="grid grid-cols-[400px_1fr] gap-12">
        <div className="bg-surface-container flex h-fit flex-col gap-0.5 rounded-md p-4">
          <Link
            to="/settings"
            className={cn({
              'hover:bg-surface-container-high flex items-center gap-3 rounded-md px-3 py-2 transition ease-out': true,
              'bg-surface-container-high pointer-events-none cursor-default': activePathname === 'settings',
            })}
          >
            <User className="h-5 w-5" />
            <span>Account Details</span>
          </Link>
          <Link
            to="/settings/addresses"
            className={cn({
              'hover:bg-surface-container-high flex items-center gap-3 rounded-md px-3 py-2 transition ease-out': true,
              'bg-surface-container-high pointer-events-none cursor-default': activePathname === 'addresses',
            })}
          >
            <Map className="h-5 w-5" />
            <span>Delivery Addresses</span>
          </Link>
          <Link
            to="/settings/orders"
            className={cn({
              'hover:bg-surface-container-high flex items-center gap-3 rounded-md px-3 py-2 transition ease-out': true,
              'bg-surface-container-high pointer-events-none cursor-default': activePathname === 'orders',
            })}
          >
            <ShoppingBasket className="h-5 w-5" />
            <span>Orders</span>
          </Link>
          <Link
            to="/settings/payment"
            className={cn({
              'hover:bg-surface-container-high flex items-center gap-3 rounded-md px-3 py-2 transition ease-out': true,
              'bg-surface-container-highest pointer-events-none cursor-default': activePathname === 'payment',
            })}
          >
            <CreditCard className="h-5 w-5" />
            <span>Payment Methods</span>
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
