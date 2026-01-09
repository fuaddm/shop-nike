import { useEffect, useState } from 'react';
import { type LoaderFunctionArgs, redirect } from 'react-router';
import { userContext } from '~/context/user-context';
import { userCookie } from '~/cookies.server';

import { SimpleCartItem } from '@components/page/cart/CartItem';

import { cn } from '@libs/cn';

import { authAPI } from '@api/auth-api';

import type { Route } from './+types/order';

export async function loader({ request, context, params }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};

  const user = context.get(userContext);
  if (!user?.isAuth) {
    return redirect('/');
  }

  const resp = await authAPI.get(`/user/orders/${params.orderId}`, cookie);

  const data = await resp.json();

  return { data };
}

export default function OrderPage({ loaderData }: Route.ComponentProps) {
  const orderData = loaderData.data.data;
  const [orderDate, setOrderDate] = useState('');

  useEffect(() => {
    setOrderDate(new Date(orderData.orderDate + 'Z').toLocaleString());
  }, []);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-container mb-4 h-fit rounded-md px-5 py-4">
          <div className="mb-6 text-3xl font-medium">Summary</div>
          <div className="text-on-surface-variant mb-2 flex justify-between px-2">
            <div>Subtotal</div>
            <div className="font-medium">${orderData.subTotal}</div>
          </div>
          <div className="text-on-surface-variant mb-2 flex justify-between px-2">
            <div>Shipping</div>
            <div className="font-medium">FREE</div>
          </div>
          <div className="text-on-surface-variant mb-4 flex justify-between px-2">
            <div>Discount</div>
            <div className="font-medium">${orderData.discount}</div>
          </div>
          <div className="border-outline-variant text-on-surface mb-4 flex justify-between border-y py-3 text-lg font-medium">
            <div>Total</div>
            <div className="font-medium">${orderData.totalAmount}</div>
          </div>
        </div>
        <div className="bg-surface-container flex h-fit flex-col justify-between rounded-xl p-6">
          <div className="mb-6 text-3xl font-medium">Shipping</div>
          <div className="flex flex-col gap-2">
            <div className="font-medium">
              {orderData.shippingAddress.firstName} {orderData.shippingAddress.lastName}
            </div>
            <div className="text-on-surface-variant">{orderData.shippingAddress.country}</div>
            <div className="text-on-surface-variant">{orderData.shippingAddress.streetAddress}</div>
            {orderData.shippingAddress.streetAddressSecond && (
              <div className="text-on-surface-variant">{orderData.shippingAddress.streetAddressSecond}</div>
            )}
            <div className="text-on-surface-variant">{orderData.shippingAddress.city}</div>
            <div className="text-on-surface-variant">{orderData.shippingAddress.phoneNumber}</div>
            <div className="text-on-surface-variant">{orderData.shippingAddress.zipCode}</div>
          </div>
        </div>
      </div>

      <div className="text-on-surface-variant">Order Date: {orderDate}</div>
      {orderData.trackingNumber && (
        <div className="text-on-surface-variant">Tracking Number: {orderData.trackingNumber}</div>
      )}
      <div className="text-on-surface-variant mb-8">Total Price: ${orderData.totalAmount}</div>
      <div
        className={cn({
          'mb-3 w-fit rounded-full px-3 py-0.5 text-sm font-medium text-white': true,
          'bg-amber-500': orderData.statusName === 'Pending',
          'bg-blue-500': orderData.statusName === 'Shipped',
          'bg-green-500': orderData.statusName === 'Delivered',
          'bg-red-500': orderData.statusName === 'Cancelled',
        })}
      >
        {orderData.statusName}
      </div>
      <div className="flex flex-col gap-2">
        {orderData.items.map((item) => {
          return (
            <SimpleCartItem
              key={item.baseProductId}
              id={item.baseProductId}
              img={item.image}
              color={item.colorName}
              category={item.main_category}
              discountedPrice={item.discountedPrice}
              price={item.price}
              subtotal={item.subtotal}
              quantity={item.quantity}
              name={item.productName}
              size={item.sizeName}
              variationCode={item.productId}
            />
          );
        })}
      </div>
      <div className=""></div>
    </div>
  );
}
