import { StarIcon } from '@icons/StarIcon';

import { generateRelativeTime } from '@libs/date';
import { starFillPercentage } from '@libs/star';

export function Review({ stars, date, comment, name }: { stars: number; comment: string; date: string; name: string }) {
  return (
    <div className="bg-surface-container rounded-md p-4">
      <div className="mb-1 font-medium">{name}</div>
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
          <div className="text-on-surface-variant text-xs font-semibold">{stars}</div>
        </div>
        <div className="text-on-surface-variant text-sm font-medium">{generateRelativeTime(date)}</div>
      </div>
      <div className="text-on-surface-variant">{comment}</div>
    </div>
  );
}
