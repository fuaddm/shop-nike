import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import { Button } from 'react-aria-components';
import { Form, redirect, useFetcher, useRouteLoaderData } from 'react-router';
import { userContext } from '~/context/user-context';
import { userCookie } from '~/cookies.server';

import { PaginationProducts } from '@components/page/products/PaginationProducts';
import { FavProductCard } from '@components/page/shared/FavProductCard';
import { SkeletonProductCard } from '@components/page/shared/SkeletonProductCard';

import { HeartIcon } from '@icons/HeartIcon';

import { cn } from '@libs/cn';

import { authAPI } from '@api/auth-api';

import type { Route } from '.react-router/types/app/routes/+types/favourites';

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  if (!user?.isAuth) {
    return redirect('/');
  }
}

export async function action({ request }: Route.ActionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};

  const formData = await request.formData();
  const variationCode = String(formData.get('variationCode'));

  try {
    await authAPI.post(`/user/toggle-favorite?variationCode=${variationCode}`, cookie);

    return { success: true };
  } catch {
    return { success: false };
  }
}

export default function FavouritePage() {
  const fetcher = useFetcher();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const loaderData = useRouteLoaderData('root');

  const [pageNumber, setPageNumber] = useQueryState('PageNumber', {
    defaultValue: '1',
    scroll: true,
  });

  useEffect(() => {
    fetcher.load(`/favourites-data?page=${pageNumber}`);
  }, [pageNumber]);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      setProducts(fetcher.data.items);
      setTotal(fetcher.data.totalCount ?? 1);
    }
  }, [fetcher]);

  return (
    <div className="container pt-12">
      <div className="mb-12 text-center text-3xl font-semibold">Favourites</div>
      <div className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {(fetcher.state === 'loading' || (fetcher.state === 'idle' && fetcher.data === undefined)) && (
          <>
            {Array.from({ length: Math.min(loaderData.favourites.data.totalCount, 12) })
              .fill(0)
              .map((_, index) => {
                return <SkeletonProductCard key={index} />;
              })}
          </>
        )}
        {fetcher.state !== 'loading' && (
          <>
            {products.map((item) => {
              return (
                <Form
                  method="POST"
                  key={item.product.id}
                  className="relative block"
                >
                  <input
                    type="hidden"
                    name="variationCode"
                    value={item.variation.code}
                  />
                  <Button
                    type="submit"
                    className="bg-surface-container/40 hover:bg-surface-container-highest border-outline-variant absolute top-6 right-5 w-8 cursor-default rounded-full border p-1.5 transition"
                  >
                    <HeartIcon
                      className={cn({
                        'stroke-on-surface h-full w-full fill-transparent transition-all': true,
                        'fill-red-500 stroke-red-500': true,
                      })}
                    />
                  </Button>
                  <FavProductCard
                    id={item.product.id}
                    name={item.product.name}
                    image={item.image}
                    category={item.category}
                    mainCategory={item.mainCategory}
                    variations={[item.variation]}
                    pricing={item.pricing}
                  />
                </Form>
              );
            })}
          </>
        )}
      </div>
      {loaderData.favourites.data.totalCount === 0 && (
        <div className="mb-12 grid w-full place-items-center">
          <img
            src="/svg/Pack.svg"
            className="aspect-square w-50"
          />
        </div>
      )}
      {fetcher.state !== 'loading' && products.length > 0 && <PaginationProducts total={total} />}
    </div>
  );
}
