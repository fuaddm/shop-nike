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
  const loading = fetcher.state !== 'idle';
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
          isDisabled={loading}
          className="bg-secondary text-on-secondary hover:bg-secondary/80 relative w-fit cursor-pointer overflow-hidden rounded-lg px-6 py-2 transition ease-out"
        >
          {(defaultReview?.stars ?? 0 !== 0) ? 'Edit' : 'Send'}
          {loading && (
            <div className="bg-primary-fixed absolute top-0 left-0 z-10 grid h-full w-full place-items-center py-2.5">
              <svg
                aria-hidden="true"
                className="fill-on-primary aspect-square h-full animate-spin text-transparent"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </Button>
      </fetcher.Form>
    </div>
  );
}
