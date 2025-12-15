import { useEffect, useState } from 'react';
import { Button } from 'react-aria-components';
import { useFetcher, useRouteLoaderData } from 'react-router';
import { toast } from 'sonner';

import { HeartIcon } from '@icons/HeartIcon';

import { cn } from '@libs/cn';

export function CartFavourite({ variationCode }: { variationCode: string }) {
  const fetcher = useFetcher();
  const { favourites, user } = useRouteLoaderData('root');

  const [isFav, setIsFav] = useState<boolean>(() => {
    if (favourites && favourites.data) {
      return favourites.data.items.some((favourite) => {
        return favourite.variation.code === variationCode;
      });
    }
    return false;
  });

  useEffect(() => {
    if (favourites && favourites.data) {
      let hasFound = false;
      favourites.data.items.map((favourite) => {
        if (favourite.variation.code === variationCode) {
          setIsFav(true);
          hasFound = true;
        }
      });
      if (!hasFound) {
        setIsFav(false);
      }
    }
  }, [favourites]);

  useEffect(() => {
    if (fetcher.state === 'submitting' && fetcher.formAction === '/favourites') {
      const optimisticIsFav = fetcher.formData?.get('isFav');
      setIsFav(optimisticIsFav === '0' ? false : true);
    }
  }, [fetcher]);

  function addToFavourite() {
    const formData = new FormData();
    formData.append('variationCode', String(variationCode));
    formData.append('isFav', isFav ? '0' : '1');
    fetcher.submit(formData, {
      method: 'POST',
      action: '/favourites',
    });
  }

  return (
    <Button
      type="button"
      onPress={() => {
        if (user?.isAuth) {
          addToFavourite();
        } else {
          toast.warning('Sign in to save');
        }
      }}
      className="bg-surface-container-highest hover:bg-surface-dim group aspect-square w-10 rounded-full p-2.5 transition ease-out"
    >
      <HeartIcon
        className={cn({
          'stroke-on-surface h-full w-full fill-transparent transition-all': true,
          'fill-red-500 stroke-red-500': isFav,
        })}
      />
    </Button>
  );
}
