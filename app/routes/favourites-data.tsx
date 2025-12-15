import type { LoaderFunctionArgs, ShouldRevalidateFunction } from 'react-router';
import { userContext } from '~/context/user-context';
import { userCookie } from '~/cookies.server';
import { PAGE_SIZE } from '~/routes/products-data';

import { authAPI } from '@api/auth-api';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};
  const url = new URL(request.url);
  url.searchParams.append('PageSize', String(PAGE_SIZE));

  const user = context.get(userContext);
  let products;

  if (user?.isAuth) {
    const resp = await authAPI.get(`/user/favorites${url.search}`, cookie);
    const data = await resp.json();
    products = data.data;
    return products;
  }
}

export const shouldRevalidate: ShouldRevalidateFunction = ({ formAction }) => {
  if (formAction === '/theme') return false;
  return true;
};
