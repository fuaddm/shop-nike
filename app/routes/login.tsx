import { data } from 'react-router';
import { z } from 'zod';
import { userCookie } from '~/cookies.server';

import { publicAPI } from '@api/public-api';

import type { Route } from '.react-router/types/app/routes/+types/login';

const formSchema = z.object({
  email: z.string().nonempty('Email must be entered.').email('Email address must be in the correct format.'),

  password: z
    .string()
    .nonempty('Password must be entered.')
    .min(8, 'Password must be at least 8 characters long.')
    .refine((value) => /[A-Z]/.test(value), {
      message: 'Password must contain at least 1 uppercase letter.',
    })
    .refine((value) => /[a-z]/.test(value), {
      message: 'Password must contain at least 1 lowercase letter.',
    })
    .refine((value) => /[0-9]/.test(value), {
      message: 'Password must contain at least 1 digit.',
    })
    .refine((value) => /[@$!%*?&]/.test(value), {
      message: 'Password must contain at least 1 special character. (@, $, !, %, *, ?, &)',
    }),

  // rememberMe üçün preprocess: "on" | "true" | true -> true, digər hallarda false
  rememberMe: z.preprocess((value) => {
    // value: string | null | boolean | File
    if (typeof value === 'string') {
      return value === 'on' || value === 'true';
    }
    if (typeof value === 'boolean') return value;
    return false;
  }, z.boolean()),
});

export async function action({ request }: Route.ActionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};

  const formData = await request.formData();
  const raw = {
    email: formData.get('email') as string | null,
    password: formData.get('password') as string | null,
    rememberMe: formData.get('rememberMe'), // "on" | null
  };

  try {
    const parsedData = formSchema.parse(raw);

    const resp = await publicAPI.post('/security/sign-in', cookie, {
      body: JSON.stringify(parsedData),
      headers: {
        token: cookie.publicToken,
        'Content-Type': 'application/json',
      },
    });

    const respData = await resp.json();

    if (respData.result.code !== 200) {
      return { success: false, errors: null, rawError: null, errorMsg: respData.result.errorMsg };
    }

    cookie.privateToken = respData?.data?.token;
    cookie.rememberMeToken = respData?.data?.rememberMeToken;

    return data(
      { success: true, data },
      {
        headers: {
          'Set-Cookie': await userCookie.serialize(cookie),
        },
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      for (const issue of error.issues) {
        const path = issue.path[0];
        if (typeof path === 'string' && !errors[path]) {
          errors[path] = issue.message;
        }
      }

      return { success: false, errors, rawError: error };
    }

    // Optionally handle other errors
    return { success: false, errors: { general: 'Unexpected error' }, rawError: error };
  }
}
