import { type ActionFunctionArgs, redirect } from 'react-router';
import { userCookie } from '~/cookies.server';

import { authAPI } from '@api/auth-api';

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};

  try {
    const resp = await authAPI.patch('/user/delete-account', cookie);

    if (resp.status === 200) {
      return redirect('/', {
        headers: {
          'Set-Cookie': await userCookie.serialize({}),
        },
      });
    } else {
      const errorBody = await resp.text();
      console.log('Error Body (Text):', errorBody);
    }
    return { success: false };
  } catch {
    return { success: false };
  }
}
