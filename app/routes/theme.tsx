import { data } from 'react-router';
import { themeCookie } from '~/cookies.server';

import type { Route } from '.react-router/types/app/routes/+types/theme';

export async function action({ request }: Route.ClientActionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await themeCookie.parse(cookieHeader)) || {};
  const formData = await request.formData();

  cookie.theme = formData.get('theme');

  return data('', {
    headers: {
      'Set-Cookie': await themeCookie.serialize(cookie),
    },
  });
}
