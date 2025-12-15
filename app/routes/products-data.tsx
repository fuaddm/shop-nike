import type { LoaderFunctionArgs, ShouldRevalidateFunction } from 'react-router';
import { userContext } from '~/context/user-context';
import { userCookie } from '~/cookies.server';

import { authAPI } from '@api/auth-api';
import { publicAPI } from '@api/public-api';

export const PAGE_SIZE = 12;

export async function loader({ request, context }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};
  const url = new URL(request.url);
  url.searchParams.append('PageSize', String(PAGE_SIZE));
  const search = url.searchParams.get('search');

  const user = context.get(userContext);
  let products;
  if (user?.isAuth) {
    if (search) {
      const resp = await authAPI.post('/user/search', cookie, {
        body: JSON.stringify({
          mainCategoryId: url.searchParams.get('MainCategoryId'),
          categoryId: url.searchParams.get('CategoryId'),
          subCategoryId: url.searchParams.get('SubCategoryId'),
          fabric: null,
          keywords: null,
          productName: search,
          clothingGenderId: url.searchParams.getAll('ClothingGenderId'),
          priceRangeId: url.searchParams.get('PriceRangeId'),
          colorId: url.searchParams.getAll('ColorId'),
          sortId: url.searchParams.get('SortId'),
          pageNumber: url.searchParams.get('PageNumber'),
          pageSize: url.searchParams.get('PageSize'),
        }),
      });
      const data = await resp.json();
      products = data.data;
    } else {
      const resp = await authAPI.get(`/user/products${url.search}`, cookie);
      const data = await resp.json();
      products = data.data;
    }
  } else {
    if (search) {
      const resp = await publicAPI.post('/user/search', cookie, {
        body: JSON.stringify({
          mainCategoryId: url.searchParams.get('MainCategoryId'),
          categoryId: url.searchParams.get('CategoryId'),
          subCategoryId: url.searchParams.get('SubCategoryId'),
          fabric: null,
          keywords: null,
          productName: search,
          clothingGenderId: url.searchParams.getAll('ClothingGenderId'),
          priceRangeId: url.searchParams.get('PriceRangeId'),
          colorId: url.searchParams.getAll('ColorId'),
          sortId: url.searchParams.get('SortId'),
          pageNumber: url.searchParams.get('PageNumber'),
          pageSize: url.searchParams.get('PageSize'),
        }),
      });
      const data = await resp.json();
      products = data.data;
    } else {
      const resp = await publicAPI.get(`/user/products${url.search}`, cookie);
      const data = await resp.json();
      products = data.data;
    }
  }

  return products;
}

export const shouldRevalidate: ShouldRevalidateFunction = ({ currentParams, nextParams, nextUrl }) => {
  if (!nextUrl.pathname.startsWith('/products')) return false;
  if (currentParams !== nextParams) return true;
  return false;
};
