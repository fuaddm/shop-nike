import { data } from 'react-router';
import { userCookie } from '~/cookies.server';

import { mainAPI } from '@api/config';

import type { Route } from '.react-router/types/app/routes/+types/logout';

export async function action({ request }: Route.ActionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};

  try {
    await mainAPI.post('/security/logout', null, {
      headers: {
        token: cookie.privateToken,
      },
    });
  } catch {
    return data({ success: false });
  }

  return data(
    { success: true },
    {
      headers: {
        'Set-Cookie': await userCookie.serialize({}),
      },
    }
  );
}
