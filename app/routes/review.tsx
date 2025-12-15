import type { ActionFunctionArgs, LoaderFunctionArgs, ShouldRevalidateFunction } from 'react-router';
import { userContext } from '~/context/user-context';
import { userCookie } from '~/cookies.server';

import { authAPI } from '@api/auth-api';
import { publicAPI } from '@api/public-api';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const variationCode = url.searchParams.get('variationCode');

  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};

  const user = context.get(userContext);

  if (user?.isAuth) {
    const resp = await authAPI.get(`/user/product-reviews?variationCode=${variationCode}`, cookie);
    const data = await resp.json();

    return data.data;
  }
  const resp = await publicAPI.get(`/user/product-reviews?variationCode=${variationCode}`, cookie);
  const data = await resp.json();

  return data.data;
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const comment = String(formData.get('comment'));
  const variationCode = String(formData.get('variationCode'));
  const stars = String(formData.get('stars'));

  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};

  const user = context.get(userContext);

  const searchParams = new URLSearchParams({
    comment,
    rating: stars ?? '1',
    variationCode,
  });

  const queryString = searchParams.toString();

  if (user?.isAuth) {
    const resp = await authAPI.post(`/user/add-or-update-review?${queryString}`, cookie);
    const data = await resp.json();

    return data;
  }
}

export const shouldRevalidate: ShouldRevalidateFunction = ({ formAction }) => {
  if (formAction === '/review') return true;
  return false;
};
