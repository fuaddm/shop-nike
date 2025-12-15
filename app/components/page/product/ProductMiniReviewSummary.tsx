import { StarIcon } from '@icons/StarIcon';

import { cn } from '@libs/cn';
import { starFillPercentage } from '@libs/star';

import type { IProductMiniReviewSummary } from '@models/components/page/product/productMiniReviewSummary';

export function ProductMiniReviewSummary({ stars, totalReviewCount, ...properties }: IProductMiniReviewSummary) {
  return (
    <div
      {...properties}
      className={cn(
        'bg-secondary-container flex w-fit items-center gap-1 rounded-full px-3 py-2',
        properties.className
      )}
    >
      <div className="relative z-0">
        <StarIcon className="fill-on-secondary-container/50 aspect-square max-w-5 min-w-5" />
        <StarIcon
          className="fill-on-secondary-container absolute top-0 left-0 z-0 aspect-square max-w-5 min-w-5"
          style={{
            clipPath: `inset(0% ${100 - starFillPercentage(stars, 1)}% 0% 0%)`,
          }}
        />
      </div>
      <div className="relative z-0">
        <StarIcon className="fill-on-secondary-container/50 aspect-square max-w-5 min-w-5" />
        <StarIcon
          className="fill-on-secondary-container absolute top-0 left-0 z-0 aspect-square max-w-5 min-w-5"
          style={{
            clipPath: `inset(0% ${100 - starFillPercentage(stars, 2)}% 0% 0%)`,
          }}
        />
      </div>
      <div className="relative z-0">
        <StarIcon className="fill-on-secondary-container/50 aspect-square max-w-5 min-w-5" />
        <StarIcon
          className="fill-on-secondary-container absolute top-0 left-0 z-0 aspect-square max-w-5 min-w-5"
          style={{
            clipPath: `inset(0% ${100 - starFillPercentage(stars, 3)}% 0% 0%)`,
          }}
        />
      </div>
      <div className="relative z-0">
        <StarIcon className="fill-on-secondary-container/50 aspect-square max-w-5 min-w-5" />
        <StarIcon
          className="fill-on-secondary-container absolute top-0 left-0 z-0 aspect-square max-w-5 min-w-5"
          style={{
            clipPath: `inset(0% ${100 - starFillPercentage(stars, 4)}% 0% 0%)`,
          }}
        />
      </div>
      <div className="relative z-0">
        <StarIcon className="fill-on-secondary-container/50 aspect-square max-w-5 min-w-5" />
        <StarIcon
          className="fill-on-secondary-container absolute top-0 left-0 z-0 aspect-square max-w-5 min-w-5"
          style={{
            clipPath: `inset(0% ${100 - starFillPercentage(stars, 5)}% 0% 0%)`,
          }}
        />
      </div>
      <div className="text-on-secondary bg-on-secondary-container ms-2 rounded-full px-2 text-sm font-medium">
        {totalReviewCount} reviews
      </div>
    </div>
  );
}
