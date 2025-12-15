import { Link, useRouteLoaderData } from 'react-router';
import { getTitle } from '~/routes/products-home';

import type { IProduct } from '@models/product';

export function FavProductCard(properties: IProduct) {
  const { name, image, variations, pricing, category, mainCategory } = properties;
  const { hierarchy } = useRouteLoaderData('root');
  const hierarchies = hierarchy.data.hierarchies;
  const subTitle = getTitle(hierarchies, mainCategory.id, category.id);

  return (
    <div className="bg-surface-container-low group flex h-full flex-col justify-between rounded-md p-2 md:px-3 md:py-4">
      <div className="mb-2">
        <Link
          to={`/product/${variations[0].code}`}
          className="bg-surface-container-high mb-2 block aspect-square overflow-hidden rounded-md"
        >
          <img
            src={image}
            className="h-full w-full object-cover"
            alt=""
          />
        </Link>
        <div className="relative">
          <Link
            to={`/product/${variations[0].code}`}
            className="block w-fit ps-1 text-base font-bold md:text-lg"
          >
            {name}
          </Link>
          <div className="text-on-surface-variant w-fit ps-1 text-base">{subTitle}</div>
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
