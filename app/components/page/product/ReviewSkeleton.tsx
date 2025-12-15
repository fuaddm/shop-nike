import { StarIcon } from '@icons/StarIcon';

import { starFillPercentage } from '@libs/star';

export function ReviewSkeleton() {
  const stars = 5;
  return (
    <div className="bg-surface-container rounded-md p-4">
      <div className="bg-on-surface mb-1 w-fit animate-pulse rounded-md font-medium text-transparent">
        name name name
      </div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="flex gap-0.5">
            <div className="relative z-0">
              <StarIcon className="fill-on-secondary-container/50 aspect-square max-w-4 min-w-4" />
              <StarIcon
                className="absolute top-0 left-0 z-0 aspect-square max-w-4 min-w-4 fill-orange-400"
                style={{
                  clipPath: `inset(0% ${100 - starFillPercentage(stars, 1)}% 0% 0%)`,
                }}
              />
            </div>
            <div className="relative z-0">
              <StarIcon className="fill-on-secondary-container/50 aspect-square max-w-4 min-w-4" />
              <StarIcon
                className="absolute top-0 left-0 z-0 aspect-square max-w-4 min-w-4 fill-orange-400"
                style={{
                  clipPath: `inset(0% ${100 - starFillPercentage(stars, 2)}% 0% 0%)`,
                }}
              />
            </div>
            <div className="relative z-0">
              <StarIcon className="fill-on-secondary-container/50 aspect-square max-w-4 min-w-4" />
              <StarIcon
                className="absolute top-0 left-0 z-0 aspect-square max-w-4 min-w-4 fill-orange-400"
                style={{
                  clipPath: `inset(0% ${100 - starFillPercentage(stars, 3)}% 0% 0%)`,
                }}
              />
            </div>
            <div className="relative z-0">
              <StarIcon className="fill-on-secondary-container/50 aspect-square max-w-4 min-w-4" />
              <StarIcon
                className="absolute top-0 left-0 z-0 aspect-square max-w-4 min-w-4 fill-orange-400"
                style={{
                  clipPath: `inset(0% ${100 - starFillPercentage(stars, 4)}% 0% 0%)`,
                }}
              />
            </div>
            <div className="relative z-0">
              <StarIcon className="fill-on-secondary-container/50 aspect-square max-w-4 min-w-4" />
              <StarIcon
                className="absolute top-0 left-0 z-0 aspect-square max-w-4 min-w-4 fill-orange-400"
                style={{
                  clipPath: `inset(0% ${100 - starFillPercentage(stars, 5)}% 0% 0%)`,
                }}
              />
            </div>
          </div>
          <div className="text-on-surface-variant text-xs font-semibold"></div>
        </div>
        <div className="bg-on-surface-variant animate-pulse rounded-md text-sm font-medium text-transparent">
          18 hours ago
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="bg-on-surface-variant h-[20px] animate-pulse rounded-md text-transparent">comment</div>
        <div className="bg-on-surface-variant h-[20px] w-1/2 animate-pulse rounded-md text-transparent">comment</div>
        <div className="bg-on-surface-variant h-[20px] w-1/3 animate-pulse rounded-md text-transparent">comment</div>
      </div>
    </div>
  );
}
