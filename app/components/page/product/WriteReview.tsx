import { useState } from 'react';
import { Button } from 'react-aria-components';
import { useFetcher, useParams } from 'react-router';
import { toast } from 'sonner';

import { StarIcon } from '@icons/StarIcon';

import { cn } from '@libs/cn';

export function WriteReview({
  defaultReview = {
    review_comment: '',
    review_date: '',
    reviewer_name: '',
    stars: 0,
  },
}: {
  defaultReview?: { review_comment: string; review_date: string; reviewer_name: string | null; stars: number };
}) {
  const fetcher = useFetcher();
  const { variationCode } = useParams();

  const [stars, setStars] = useState({
    mainStars: defaultReview?.stars ?? 0,
    hoveredStars: 0,
    activeState: 'mainStars',
  });

  const uiStars = stars.activeState === 'mainStars' ? stars.mainStars : stars.hoveredStars;

  return (
    <div className="bg-surface-container rounded-md p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex gap-2">
          <div
            onMouseLeave={() =>
              setStars((prev) => {
                return {
                  ...prev,
                  activeState: 'mainStars',
                };
              })
            }
            onMouseEnter={() =>
              setStars((prev) => {
                return {
                  ...prev,
                  activeState: 'hoveredStars',
                };
              })
            }
            className="flex gap-0.5"
          >
            <Button
              className="relative z-0 cursor-pointer transition ease-out data-pressed:scale-80"
              onMouseEnter={() =>
                setStars((prev) => {
                  return {
                    ...prev,
                    hoveredStars: 1,
                    activeState: 'hoveredStars',
                  };
                })
              }
              onPress={() => {
                setStars((prev) => {
                  return {
                    ...prev,
                    mainStars: 1,
                  };
                });
              }}
            >
              <StarIcon className="fill-on-secondary-container/50 aspect-square max-w-5 min-w-5" />
              <StarIcon
                className={cn({
                  'absolute top-0 left-0 z-0 aspect-square max-w-5 min-w-5 fill-transparent transition-all duration-100': true,
                  'fill-orange-400': uiStars > 0,
                })}
              />
            </Button>
            <Button
              className="relative z-0 cursor-pointer transition ease-out data-pressed:scale-80"
              onMouseEnter={() =>
                setStars((prev) => {
                  return {
                    ...prev,
                    hoveredStars: 2,
                    activeState: 'hoveredStars',
                  };
                })
              }
              onPress={() => {
                setStars((prev) => {
                  return {
                    ...prev,
                    mainStars: 2,
                  };
                });
              }}
            >
              <StarIcon className="fill-on-secondary-container/50 aspect-square max-w-5 min-w-5" />
              <StarIcon
                className={cn({
                  'absolute top-0 left-0 z-0 aspect-square max-w-5 min-w-5 fill-transparent transition-all duration-100': true,
                  'fill-orange-400': uiStars > 1,
                })}
              />
            </Button>
            <Button
              className="relative z-0 cursor-pointer transition ease-out data-pressed:scale-80"
              onMouseEnter={() =>
                setStars((prev) => {
                  return {
                    ...prev,
                    hoveredStars: 3,
                    activeState: 'hoveredStars',
                  };
                })
              }
              onPress={() => {
                setStars((prev) => {
                  return {
                    ...prev,
                    mainStars: 3,
                  };
                });
              }}
            >
              <StarIcon className="fill-on-secondary-container/50 aspect-square max-w-5 min-w-5" />
              <StarIcon
                className={cn({
                  'absolute top-0 left-0 z-0 aspect-square max-w-5 min-w-5 fill-transparent transition-all duration-100': true,
                  'fill-orange-400': uiStars > 2,
                })}
              />
            </Button>
            <Button
              className="relative z-0 cursor-pointer transition ease-out data-pressed:scale-80"
              onMouseEnter={() =>
                setStars((prev) => {
                  return {
                    ...prev,
                    hoveredStars: 4,
                    activeState: 'hoveredStars',
                  };
                })
              }
              onPress={() => {
                setStars((prev) => {
                  return {
                    ...prev,
                    mainStars: 4,
                  };
                });
              }}
            >
              <StarIcon className="fill-on-secondary-container/50 aspect-square max-w-5 min-w-5" />
              <StarIcon
                className={cn({
                  'absolute top-0 left-0 z-0 aspect-square max-w-5 min-w-5 fill-transparent transition-all duration-100': true,
                  'fill-orange-400': uiStars > 3,
                })}
              />
            </Button>
            <Button
              className="relative z-0 cursor-pointer transition ease-out data-pressed:scale-80"
              onMouseEnter={() =>
                setStars((prev) => {
                  return {
                    ...prev,
                    hoveredStars: 5,
                    activeState: 'hoveredStars',
                  };
                })
              }
              onPress={() => {
                setStars((prev) => {
                  return {
                    ...prev,
                    mainStars: 5,
                  };
                });
              }}
            >
              <StarIcon className="fill-on-secondary-container/50 aspect-square max-w-5 min-w-5" />
              <StarIcon
                className={cn({
                  'absolute top-0 left-0 z-0 aspect-square max-w-5 min-w-5 fill-transparent transition-all duration-100': true,
                  'fill-orange-400': uiStars > 4,
                })}
              />
            </Button>
          </div>
          <div className="text-on-surface-variant text-xs font-semibold"></div>
        </div>
      </div>
      <fetcher.Form
        method="POST"
        action="/review"
        onSubmit={(e) => {
          if (stars.mainStars === 0) {
            e.preventDefault();
            toast.warning('Please add a rating before submission');
          }
        }}
        className="flex flex-col gap-4"
      >
        <textarea
          name="comment"
          id="comment"
          defaultValue={defaultReview?.review_comment || ''}
          maxLength={1000}
          placeholder="Your detailed review (e.g., pros, cons, recommendations). (Max 1000 characters)"
          className="bg-surface-bright rounded-md p-2.5 focus:outline-none"
          rows={4}
        ></textarea>
        <input
          type="hidden"
          name="stars"
          value={stars.mainStars}
        />
        <input
          type="hidden"
          name="variationCode"
          value={variationCode}
        />
        <Button
          type="submit"
          className="bg-secondary text-on-secondary hover:bg-secondary/80 w-fit cursor-pointer rounded-lg px-6 py-2 transition ease-out"
        >
          {(defaultReview?.stars ?? 0 !== 0) ? 'Edit' : 'Send'}
        </Button>
      </fetcher.Form>
    </div>
  );
}
