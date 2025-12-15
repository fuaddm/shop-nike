import { data, useLoaderData } from 'react-router';
import { userCookie } from '~/cookies.server';

import { HomeIntro } from '@components/page/home/HomeIntro';
import { HomePosters } from '@components/page/home/HomePosters';
import { Spotlight } from '@components/page/home/Spotlight';
import { ProductsSection } from '@components/page/shared/ProductsSection';

import { publicAPI } from '@api/public-api';

import type { Route } from '.react-router/types/app/routes/+types/home';

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};

  const productResp = await publicAPI.get('/user/products?PageNumber=1&PageSize=10', cookie);

  const products = await productResp.json();

  return data({ products });
}

export default function Home() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div>
      <HomeIntro />
      <HomePosters />
      <ProductsSection products={loaderData.products} />
      <Spotlight />
    </div>
  );
}
