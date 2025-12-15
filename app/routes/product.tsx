import { useEffect, useState } from 'react';
import { Button } from 'react-aria-components';
import { useFetcher, useLoaderData, useParams, useRouteLoaderData } from 'react-router';
import { toast } from 'sonner';
import { userContext } from '~/context/user-context';
import { userCookie } from '~/cookies.server';

import { ProductDisclosure } from '@ui/disclosure/ProductDisclosure';

import { ProductImagesSlider } from '@components/page/product/ProductImagesSlider';
import { ProductMiniReviewSummary } from '@components/page/product/ProductMiniReviewSummary';
import { Reviews } from '@components/page/product/Reviews';
import { SimilarProducts } from '@components/page/product/SimilarProducts';
import { Sizes } from '@components/page/product/Sizes';

import { HeartIcon } from '@icons/HeartIcon';

import { cn } from '@libs/cn';

import { authAPI } from '@api/auth-api';
import { publicAPI } from '@api/public-api';

import type { Route } from '.react-router/types/app/routes/+types/product';

export async function loader({ params, request, context }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};

  const user = context.get(userContext);

  if (user?.isAuth) {
    const resp = await authAPI.get(`/user/product-info?variationCode=${params.variationCode}`, cookie);
    const data = await resp.json();

    return data;
  } else {
    const resp = await publicAPI.get(`/user/product-info?variationCode=${params.variationCode}`, cookie);
    const data = await resp.json();

    return data;
  }
}

export async function action({ request }: Route.ActionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};

  const formData = await request.formData();
  const variationCode = formData.get('variationCode');
  const sizeId = formData.get('sizeId');

  const params = new URLSearchParams();

  params.append('variationCode', String(variationCode));
  params.append('sizeId', String(sizeId));

  const paramString = params.toString();

  try {
    const resp = await authAPI.post(`/user/add-to-cart?${paramString}`, cookie);
    const data = await resp.json();
    if (data.result.status === false) {
      return { success: false };
    }
    return { success: true };
  } catch {
    return { success: false };
  }
}

export default function Product() {
  const fetcher = useFetcher();
  const basketFetcher = useFetcher({ key: 'basket' });
  const { variationCode } = useParams();

  const similarFetcher = useFetcher({ key: 'similarProducts' });

  const loaderData = useLoaderData<typeof loader>();
  const { favourites, user } = useRouteLoaderData('root');

  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);

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
      favourites.data.items.map((favourite) => {
        if (favourite.variation.code === variationCode) {
          setIsFav(true);
        }
      });
    }
  }, [favourites]);

  useEffect(() => {
    if (fetcher.state === 'submitting' && fetcher.formAction === '/favourites') {
      const optimisticIsFav = fetcher.formData?.get('isFav');
      setIsFav(optimisticIsFav === '0' ? false : true);
    }
  }, [fetcher]);

  const product = loaderData.data;

  useEffect(() => {
    similarFetcher.load(`/products-data?MainCategoryId=${product.mainCategory.id}&CategoryId=${product.category.id}`);
  }, []);

  useEffect(() => {
    if (similarFetcher.state === 'idle' && similarFetcher.data) {
      setSimilarProducts(similarFetcher.data.items);
      setSimilarLoading(false);
    }
  }, [similarFetcher]);

  const name = product.product.name;
  const price = product.pricing.price;
  let images = product.images ?? [];
  const reviewsCount = product.reviews.count;
  const totalStars = product.reviews.average ?? 0;
  const colorName = product.color.name;
  const description = product.description;

  images = images.map((image: { url: string }, index: number) => {
    return {
      id: index,
      src: image.url,
    };
  });

  function addToFavourite() {
    const formData = new FormData();
    formData.append('variationCode', String(variationCode));
    formData.append('isFav', isFav ? '0' : '1');
    fetcher.submit(formData, {
      method: 'POST',
      action: '/favourites',
    });
  }

  useEffect(() => {
    if (basketFetcher.state === 'idle' && basketFetcher.data) {
      if (basketFetcher.data.success === true) {
        toast.success('Added');
      } else {
        toast.error('Out of Stock');
      }
    }
  }, [basketFetcher]);

  return (
    <div className="container py-10">
      <div className="mb-20 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr]">
        <ProductImagesSlider images={images} />
        <basketFetcher.Form
          onSubmit={(e) => {
            if (user?.isAuth) {
              const size = e.target.sizeId.value;
              if (!size) {
                toast.warning('Please Select a Size');
                e.preventDefault();
              } else {
                toast.dismiss();
              }
            } else {
              e.preventDefault();
              toast.warning('Sign in to add');
            }
          }}
          method="POST"
          className="py-3"
        >
          <div className="mb-2 text-4xl font-bold italic">{name}</div>
          <div className="bg-surface-container mb-3 w-fit rounded-full px-3 py-1">
            <span className="text-base">{colorName}</span>
          </div>
          <ProductMiniReviewSummary
            stars={totalStars}
            totalReviewCount={reviewsCount}
            className="mb-10"
          />
          <div className="mb-14">
            <span className="flex items-start text-4xl font-semibold">
              <span className="text-2xl">$</span>
              {price}
            </span>
          </div>
          <input
            type="hidden"
            name="variationCode"
            value={variationCode}
          />
          <Sizes />
          <div className="mb-10 grid grid-cols-[1fr_min-content] items-center gap-3">
            <Button
              isDisabled={basketFetcher.state !== 'idle'}
              type="submit"
              className={cn({
                'bg-primary hover:bg-primary/90 text-on-primary w-full rounded-full py-5 text-xl font-semibold transition': true,
                'data-disabled:opacity-50': true,
              })}
            >
              Səbətə əlavə et
            </Button>
            <Button
              type="button"
              onPress={() => {
                if (user?.isAuth) {
                  addToFavourite();
                } else {
                  toast.warning('Sign in to save');
                }
              }}
              className="bg-surface-container hover:bg-surface-dim group aspect-square h-full rounded-full p-4 transition ease-out"
            >
              <HeartIcon
                className={cn({
                  'stroke-on-surface h-full w-full fill-transparent transition-all': true,
                  'fill-red-500 stroke-red-500': isFav,
                })}
              />
            </Button>
          </div>
          <ProductDisclosure
            additionalInformations={[
              { title: 'Description', text: description },
              {
                title: 'Delivery',
                text: 'We offer a range of shipping methods to best suit your needs, including standard ground shipping, expedited options, and premium express delivery for urgent orders. Available options and associated costs will be calculated at checkout based on your location and the items in your order.',
              },
            ]}
          />
        </basketFetcher.Form>
      </div>
      <Reviews
        stars={totalStars}
        totalReviewCount={reviewsCount}
      />
      <div className="mb-10"></div>
      {similarProducts.length !== 1 && (
        <SimilarProducts
          products={similarProducts.filter((similarProduct) => similarProduct.id !== product.product.id)}
          isLoading={similarLoading}
        />
      )}
    </div>
  );
}
