import { useEffect } from 'react';
import { Button } from 'react-aria-components';
import { useFetcher, useParams, useRouteLoaderData } from 'react-router';

import { Review } from '@components/page/product/Review';
import { ReviewSkeleton } from '@components/page/product/ReviewSkeleton';
import { WriteReview } from '@components/page/product/WriteReview';

import { StarIcon } from '@icons/StarIcon';

import { starFillPercentage } from '@libs/star';

export function Reviews({ stars, totalReviewCount }: { stars: number; totalReviewCount: number }) {
  const fetcher = useFetcher({ key: 'reviews' });
  const params = useParams();
  const { user } = useRouteLoaderData('root');

  useEffect(() => {
    fetcher.load(`/review?variationCode=${params.variationCode}`);
  }, []);

  return (
    <div>
      <div className="mb-2 text-3xl font-medium">Reviews ({totalReviewCount})</div>
      <div className="grid grid-cols-[300px_1fr] gap-4">
        <div className="flex w-fit flex-col">
          <div className="text-[120px] font-bold">{stars}</div>
          <div className="flex gap-1">
            <div className="relative z-0">
              <StarIcon className="fill-on-secondary-container/50 aspect-square max-w-5 min-w-5" />
              <StarIcon
                className="absolute top-0 left-0 z-0 aspect-square max-w-5 min-w-5 fill-orange-500"
                style={{
                  clipPath: `inset(0% ${100 - starFillPercentage(stars, 1)}% 0% 0%)`,
                }}
              />
            </div>
            <div className="relative z-0">
              <StarIcon className="fill-on-secondary-container/50 aspect-square max-w-5 min-w-5" />
              <StarIcon
                className="absolute top-0 left-0 z-0 aspect-square max-w-5 min-w-5 fill-orange-500"
                style={{
                  clipPath: `inset(0% ${100 - starFillPercentage(stars, 2)}% 0% 0%)`,
                }}
              />
            </div>
            <div className="relative z-0">
              <StarIcon className="fill-on-secondary-container/50 aspect-square max-w-5 min-w-5" />
              <StarIcon
                className="absolute top-0 left-0 z-0 aspect-square max-w-5 min-w-5 fill-orange-500"
                style={{
                  clipPath: `inset(0% ${100 - starFillPercentage(stars, 3)}% 0% 0%)`,
                }}
              />
            </div>
            <div className="relative z-0">
              <StarIcon className="fill-on-secondary-container/50 aspect-square max-w-5 min-w-5" />
              <StarIcon
                className="absolute top-0 left-0 z-0 aspect-square max-w-5 min-w-5 fill-orange-500"
                style={{
                  clipPath: `inset(0% ${100 - starFillPercentage(stars, 4)}% 0% 0%)`,
                }}
              />
            </div>
            <div className="relative z-0">
              <StarIcon className="fill-on-secondary-container/50 aspect-square max-w-5 min-w-5" />
              <StarIcon
                className="absolute top-0 left-0 z-0 aspect-square max-w-5 min-w-5 fill-orange-500"
                style={{
                  clipPath: `inset(0% ${100 - starFillPercentage(stars, 5)}% 0% 0%)`,
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {user?.isAuth && (
            <WriteReview
              key={fetcher.data}
              defaultReview={fetcher.data?.my_review}
            />
          )}
          {(fetcher.state === 'loading' || (fetcher.state === 'idle' && fetcher.data === undefined)) && (
            <>
              {Array.from({ length: Math.min(totalReviewCount, 3) })
                .fill(0)
                .map((_, index) => {
                  return <ReviewSkeleton key={index + ':review'} />;
                })}
            </>
          )}
          {fetcher.data?.my_review && (
            <Review
              stars={fetcher.data?.my_review.stars}
              date={fetcher.data.my_review.review_date}
              comment={fetcher.data.my_review.review_comment}
              name={fetcher.data.my_review.reviewer_name ?? 'My Review'}
            />
          )}
          {fetcher.state === 'idle' && fetcher.data && (
            <>
              {fetcher.data.reviews?.map((review) => {
                return (
                  <Review
                    key={review.review_date}
                    stars={review.stars}
                    date={review.review_date}
                    comment={review.review_comment}
                    name={review.reviewer_name ?? 'User'}
                  />
                );
              })}
            </>
          )}
          <div className="mt-4 flex justify-center">
            {fetcher.data?.reviews?.length > 3 && (
              <Button className="bg-secondary text-on-secondary cursor-pointer rounded-full px-4 py-2 transition ease-out hover:scale-95">
                Show More
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
