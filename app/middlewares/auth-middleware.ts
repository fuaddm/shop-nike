import 'dotenv/config';
import { userContext } from '~/context/user-context';
import { userCookie } from '~/cookies.server';

import { publicAPI } from '@api/public-api';

export async function authMiddleware({ request, context }, next) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};

  return await checkTokens(cookie, context, next);
}

async function checkTokens(cookie, context, next) {
  if (cookie.privateToken) {
    try {
      const resp = await publicAPI.get('/user/info', cookie, {
        headers: {
          key: process.env.PLATFORM_KEY ?? '',
          token: cookie.privateToken,
        },
      });
      if (resp.statusText !== 'OK') {
        await tryToRefresh(cookie, context, next);
      } else {
        const respData = await resp.json();

        context.set(userContext, { isAuth: true, userData: respData });

        return await next();
      }
    } catch {
      await tryToRefresh(cookie, context, next);
    }
  } else {
    if (cookie.publicToken) {
      context.set(userContext, { isAuth: false });
      const response = await next();
      return response;
    } else {
      try {
        const resp = await publicAPI.post('/security/token', cookie, {
          headers: {
            key: process.env.PLATFORM_KEY ?? '',
          },
        });
        if (resp.statusText !== 'OK') {
          context.set(userContext, { isAuth: false });
          console.error('/security/token -> API not working');

          throw new Response('Public Token not working', {
            status: 401,
          });
        } else {
          const respData = await resp.json();
          if (respData?.data?.token) {
            cookie.publicToken = respData?.data?.token;

            context.set(userContext, { isAuth: false });

            const response = await next();
            response.headers.set('Set-Cookie', await userCookie.serialize(cookie));
            return response;
          }
        }
      } catch {
        context.set(userContext, { isAuth: false });
        console.error('/security/token -> API not working');

        throw new Response('Public Token not working', {
          status: 401,
        });
      }
    }
  }
}

async function tryToRefresh(cookie, context, next) {
  if (cookie.rememberMeToken) {
    const refreshResp = await fetch(process.env.BACKEND_URL + '/refresh-token', {
      method: 'POST',
      headers: {
        token: cookie.rememberMeToken,
      },
    });

    if (refreshResp.status === 200) {
      const data = await refreshResp.json();
      cookie.privateToken = data.data?.token;
    } else {
      cookie.privateToken = undefined;
      return await checkTokens(cookie, context, next);
    }
  } else {
    cookie.privateToken = undefined;
    return await checkTokens(cookie, context, next);
  }
}
