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
  console.log(loaderData.orders);
  return (
    <div className="flex flex-col gap-4">
      {loaderData.orders.data.map((order) => {
        return (
          <OrderCard
            key={order.order_id}
            img={order.products[0].first_image_url}
            status={order.order_status}
          />
        );
      })}
    </div>
  );
}
