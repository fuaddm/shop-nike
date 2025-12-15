import 'dotenv/config';
import { type IUserCookie } from '~/cookies.server';

export async function publicAPI() {
  return null;
}

publicAPI.config = {
  baseURL: process.env.BACKEND_URL,
};

publicAPI.interceptor = {
  response: async (input: string, cookie: IUserCookie, config?: RequestInit) => {
    const resp = await fetch(input, config);
    const status = resp.status;

    if (status === 401) {
      const getToken = await fetch(publicAPI.config.baseURL + '/security/token', {
        method: 'POST',
        headers: {
          key: process.env.PLATFORM_KEY ?? '',
        },
      });

      if (getToken.status === 200) {
        const data = await getToken.json();
        cookie.publicToken = data.data?.token;

        return await fetch(input, {
          ...config,
          headers: {
            ...config?.headers,
            token: cookie.publicToken ?? '',
          },
        });
      } else {
        cookie.publicToken = undefined;
        return resp;
      }
    }

    return resp;
  },
};

async function get(input: string, cookie: IUserCookie, config?: RequestInit): Promise<Response> {
  const publicToken = cookie.publicToken ?? '';

  const baseConfig = {
    method: 'GET',
    headers: {
      token: publicToken,
    },
  };

  const mergedConfig = {
    ...baseConfig,
    ...config,

    headers: {
      ...baseConfig.headers,
      ...config?.headers,
    },
  };

  return await publicAPI.interceptor.response(publicAPI.config.baseURL + input, cookie, mergedConfig);
}

async function post(input: string, cookie: IUserCookie, config?: RequestInit): Promise<Response> {
  const publicToken = cookie.publicToken ?? '';

  const baseConfig = {
    method: 'POST',
    headers: {
      token: publicToken,
      'Content-Type': 'application/json',
    },
  };

  const mergedConfig = {
    ...baseConfig,
    ...config,

    headers: {
      ...baseConfig.headers,
      ...config?.headers,
    },
  };

  return await publicAPI.interceptor.response(publicAPI.config.baseURL + input, cookie, mergedConfig);
}

async function patch() {
  return [];
}

publicAPI.get = get;
publicAPI.post = post;
publicAPI.patch = patch;
