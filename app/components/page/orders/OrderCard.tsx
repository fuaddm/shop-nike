import { Link } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';

import { cn } from '@libs/cn';

export function OrderCard({
  products,
  status,
  id = '',
  date,
}: {
  date: string;
  products: unknown[];
  status: string;
  id?: string;
}) {
  return (
    <div className="bg-surface-container rounded-md p-3">
      <div
        className={cn({
          'grid grid-cols-[280px_1fr] gap-3': products.length > 1,
          'grid grid-cols-[140px_1fr] gap-3': products.length === 1,
        })}
      >
        <Swiper
          slidesPerView={products.length > 1 ? 1.5 : 1}
          spaceBetween={12}
          className="h-[140px] w-full rounded-md"
        >
          {products.map((product) => {
            return (
              <SwiperSlide key={product.variation_code}>
                <div className="bg-surface-container-high h-[140px] overflow-hidden rounded-md">
                  <img
                    src={product.first_image_url}
                    className="h-full w-full object-cover"
                    alt=""
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="flex flex-col gap-2">
          <div
            className={cn({
              'mb-1 w-fit rounded-full px-3 py-0.5 text-sm font-medium text-white': true,
              'bg-amber-500': status === 'Pending',
              'bg-blue-500': status === 'Shipped',
              'bg-green-500': status === 'Delivered',
              'bg-red-500': status === 'Cancelled',
            })}
          >
            {status}
          </div>
          <div className="text-on-surface-variant text-sm">Order ID: {id}</div>
          <div className="text-on-surface-variant text-sm">Update Date: {new Date(date).toLocaleString()}</div>
          <Link
            to={`/settings/order/${id}`}
            className="mt-auto w-fit rounded-lg py-1 underline"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
