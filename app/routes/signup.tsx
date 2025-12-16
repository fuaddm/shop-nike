import { data } from 'react-router';
import { z } from 'zod';
import { userCookie } from '~/cookies.server';

import { mainAPI } from '@api/config';
import { publicAPI } from '@api/public-api';

import type { Route } from '.react-router/types/app/routes/+types/login';

const formSchema = z
  .object({
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

    repeatPassword: z.string().nonempty('Please re-enter the password.'),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Passwords do not match.',
    path: ['repeatPassword'],
  });

export async function action({ request }: Route.ActionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};

  const formData = await request.formData();
  const actionName = formData.get('actionName');
  const choice = Number(formData.get('choice'));

  switch (actionName) {
    case 'credentials': {
      const raw = {
        email: formData.get('email') as string | null,
        password: formData.get('password') as string | null,
        repeatPassword: formData.get('repeat-password') as string | null,
      };

      try {
        const data = formSchema.parse(raw);
        const resp = await publicAPI.post('/security/signup', cookie, {
          body: JSON.stringify(data),
        });
        const respData = await resp.json();

        if (resp.status === 200) {
          return { success: true, data };
        } else if (resp.status === 202) {
          return { success: false, restoreOrNew: true };
        }

        return { success: false, errors: null, rawError: { data: respData } };
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
        return { success: false, errors: { general: 'Unexpected error' }, rawError: error?.response || error };
      }

      break;
    }
    case 'otpSubmit': {
      const otp = formData.get('otp');

      try {
        const resp = await mainAPI.post(
          '/security/confirm-otp',
          { enteredOtpCode: otp },
          {
            headers: {
              token: cookie.publicToken,
            },
          }
        );

        const newToken = resp.data?.data?.token;
        cookie.privateToken = newToken;
        cookie.rememberMeToken = resp.data?.data?.rememberMeToken;

        return data(
          { success: true, otp },
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

      break;
    }
    case 'insert-choice': {
      try {
        const resp = await publicAPI.post('/security/insert-choice', cookie, {
          body: JSON.stringify({ choice: choice }),
        });

        if (resp.status === 200) {
          return { success: true };
        }

        const respData = await resp.json();

        return { success: false, errors: null, rawError: { data: respData } };
      } catch (error) {
        return { success: false, errors: { general: 'Unexpected error' }, rawError: error?.response || error };
        break;
      }
    }
  }
}
