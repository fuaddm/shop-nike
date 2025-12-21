import { useEffect, useState } from 'react';
import { Button } from 'react-aria-components';
import { Link, useFetcher, useRouteLoaderData } from 'react-router';
import { toast } from 'sonner';
import { getTitle } from '~/routes/products-home';

import { HeartIcon } from '@icons/HeartIcon';

import { cn } from '@libs/cn';

import type { IProduct } from '@models/product';

export function ProductCard(properties: IProduct) {
  const { id, name, image, variations, pricing, category, mainCategory } = properties;
  const { hierarchy, favourites, user } = useRouteLoaderData('root');
  const hierarchies = hierarchy.data.hierarchies;
  const subTitle = getTitle(hierarchies, mainCategory.id, category.id);
  const fetcher = useFetcher();

  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    favourites?.data?.items?.map((item) => {
      if (id === item?.product?.id) {
        setIsFavourite(true);
      }
    });
  }, []);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.success === true) {
      setIsFavourite((prev) => !prev);
    }
  }, [fetcher]);

  return (
    <div className="bg-surface-container-low group relative flex h-full flex-col justify-between rounded-md p-2 md:px-3 md:py-4">
      <div className="mb-2">
        <Link
          to={`/product/${variations[0].code}`}
          className="bg-surface-container-low mb-2 block aspect-square overflow-hidden rounded-md"
        >
          <img
            src={image}
            className="h-full w-full object-cover"
            alt=""
          />
        </Link>
        <Button
          onPress={() => {
            if (user?.isAuth) {
              const formData = new FormData();
              formData.append('variationCode', variations[0].code);
              fetcher.submit(formData, {
                method: 'POST',
                action: '/favourites',
              });
            } else {
              toast.warning('Sign in to save');
            }
          }}
          className="bg-surface-container/40 hover:bg-surface-container-highest border-outline-variant absolute top-6 right-5 w-8 cursor-default rounded-full border p-1.5 transition"
        >
          <HeartIcon
            className={cn({
              'stroke-on-surface h-full w-full fill-transparent transition-all': true,
              'fill-red-500 stroke-red-500': fetcher.formData?.get('variationCode') ? !isFavourite : isFavourite,
            })}
          />
        </Button>
        <div className="relative">
          <div className="transition ease-out group-hover:opacity-0">
            <div className="block w-fit ps-1 text-base font-bold md:text-lg">{name}</div>
            <div className="text-on-surface-variant w-fit ps-1 text-base">{variations.length} Colours</div>
            <div className="text-on-surface-variant w-fit ps-1 text-base">{subTitle}</div>
          </div>
          <div className="absolute top-0 bottom-0 left-0 flex gap-3 opacity-0 transition ease-out group-hover:opacity-100 md:mb-4">
            {variations &&
              variations.map((variation) => {
                return (
                  <Link
                    to={`/product/${variation.code}`}
                    key={variation.code}
                    className="aspect-square h-full overflow-hidden rounded-md"
                  >
                    <img
                      src={variation.image}
                      className="h-full w-full object-cover"
                      alt=""
                    />
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
      <div className="ps-1">
        <div className="flex items-start text-base font-bold md:text-xl md:font-bold">
          <span className="text-sm font-normal">$</span>
          {pricing.price}
        </div>
      </div>
    </div>
  );
}
