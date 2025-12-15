import { Link, useRouteLoaderData } from 'react-router';
import { getTitle } from '~/routes/products-home';

import type { IProduct } from '@models/product';

export function ProductCard(properties: IProduct) {
  const { id, name, image, variations, pricing, category, mainCategory } = properties;
  const { hierarchy } = useRouteLoaderData('root');
  const hierarchies = hierarchy.data.hierarchies;
  const subTitle = getTitle(hierarchies, mainCategory.id, category.id);

  return (
    <div className="bg-surface-container-low group flex h-full flex-col justify-between rounded-md p-2 md:px-3 md:py-4">
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
