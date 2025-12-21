import { type LoaderFunctionArgs, redirect } from 'react-router';
import { userContext } from '~/context/user-context';
import { userCookie } from '~/cookies.server';

import { OrderCard } from '@components/page/orders/OrderCard';

import { authAPI } from '@api/auth-api';

import type { Route } from '.react-router/types/app/routes/settings/+types/orders';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};

  const user = context.get(userContext);
  if (!user?.isAuth) {
    return redirect('/');
  }

  const resp = await authAPI.get('/user/orders', cookie);

  const data = await resp.json();

  return { orders: data };
}

export default function Orders({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col gap-4">
      {loaderData.orders?.data?.map((order) => {
        console.log(order);
        return (
          <OrderCard
            key={order.order_id}
            id={order.order_id}
            products={order.products}
            status={order.order_status}
            date={order.update_date}
          />
        );
      })}
      {loaderData.orders?.data.length === 0 && (
        <div className="mb-12 grid w-full place-items-center">
          <img
            src="/svg/Pack.svg"
            className="aspect-square w-50"
          />
        </div>
      )}
    </div>
  );
}
