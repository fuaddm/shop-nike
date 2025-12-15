import 'dotenv/config';
import { type IUserCookie } from '~/cookies.server';

export async function authAPI() {
  return { get, post, patch, put };
}

authAPI.config = {
  baseURL: process.env.BACKEND_URL,
};

authAPI.interceptor = {
  response: async (input: string, cookie: IUserCookie, config?: RequestInit) => {
    const resp = await fetch(input, config);
    const status = resp.status;
    if (status === 401 && cookie.rememberMeToken) {
      const refreshResp = await fetch(authAPI.config.baseURL + '/refresh-token', {
        method: 'POST',
        headers: {
          token: cookie.rememberMeToken,
        },
      });

      if (refreshResp.status === 200) {
        const data = await refreshResp.json();
        cookie.privateToken = data.data?.token;
        cookie.rememberMeToken = data.data?.rememberMeToken;

        return await fetch(input, {
          ...config,
          headers: {
            ...config?.headers,
            token: cookie.privateToken ?? '',
          },
        });
      } else {
        cookie.privateToken = undefined;
        cookie.rememberMeToken = undefined;
        return resp;
      }
    }

    return resp;
  },
};

async function get(input: string, cookie: IUserCookie, config?: RequestInit): Promise<Response> {
  if (cookie && cookie.privateToken) {
    const privateToken = cookie.privateToken;

    const baseConfig = {
      method: 'GET',
      headers: {
        token: privateToken,
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

    return await authAPI.interceptor.response(authAPI.config.baseURL + input, cookie, mergedConfig);
  }

  throw new Response(null, {
    status: 401,
    statusText: 'No privateToken provided',
  });
}

async function post(input: string, cookie: IUserCookie, config?: RequestInit): Promise<Response> {
  if (cookie && cookie.privateToken) {
    const privateToken = cookie.privateToken;

    const baseConfig = {
      method: 'POST',
      headers: {
        token: privateToken,
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

    return await authAPI.interceptor.response(authAPI.config.baseURL + input, cookie, mergedConfig);
  }

  throw new Response(null, {
    status: 401,
    statusText: 'No privateToken provided',
  });
}

async function patch(input: string, cookie: IUserCookie, config?: RequestInit): Promise<Response> {
  if (cookie && cookie.privateToken) {
    const privateToken = cookie.privateToken;

    const baseConfig = {
      method: 'PATCH',
      headers: {
        token: privateToken,
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

    return await authAPI.interceptor.response(authAPI.config.baseURL + input, cookie, mergedConfig);
  }

  throw new Response(null, {
    status: 401,
    statusText: 'No privateToken provided',
  });
}

async function put(input: string, cookie: IUserCookie, config?: RequestInit): Promise<Response> {
  if (cookie && cookie.privateToken) {
    const privateToken = cookie.privateToken;

    const baseConfig = {
      method: 'PUT',
      headers: {
        token: privateToken,
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

    return await authAPI.interceptor.response(authAPI.config.baseURL + input, cookie, mergedConfig);
  }

  throw new Response(null, {
    status: 401,
    statusText: 'No privateToken provided',
  });
}

authAPI.get = get;
authAPI.post = post;
authAPI.patch = patch;
authAPI.put = put;
