import { Radio, RadioGroup } from 'react-aria-components';
import { useLoaderData } from 'react-router';
import { sizes } from '~/constants/product-const';
import type { loader } from '~/routes/product';

export function Sizes() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="mb-10">
      <RadioGroup
        aria-label="size"
        name="sizeId"
        className="flex flex-wrap gap-3"
      >
        {loaderData.data?.availableSizes?.map((size) => {
          return (
            <Radio
              key={size.size}
              value={sizes.find((item) => item.size === size.size)?.id ?? size.size}
              className="bg-surface-container-highest data-selected:bg-surface-container hover:bg-surface-dim data-selected:outline-outline grid h-12 w-24 cursor-pointer place-items-center rounded-md text-lg font-medium outline-2 outline-transparent transition-all ease-out data-selected:cursor-default data-selected:outline-2"
            >
              {String(size.size).toUpperCase()}
            </Radio>
          );
        })}
      </RadioGroup>
    </div>
  );
}
