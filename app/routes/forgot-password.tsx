import type { ActionFunctionArgs } from 'react-router';
import { z } from 'zod';
import { userCookie } from '~/cookies.server';

import { publicAPI } from '@api/public-api';

const emailSchema = z.object({
  email: z.string().nonempty('Email must be entered.').email('Email address must be in the correct format.'),
});

const otpSchema = z.object({
  enteredOtpCode: z
    .string()
    .length(6, 'The OTP must be exactly 6 digits.')
    .regex(/^\d{6}$/, 'The OTP must contain only numbers.'),
});

const passwordSchema = z.object({
  newPassword: z
    .string()
    .nonempty('New Password must be entered.')
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
});

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};

  const formData = await request.formData();
  const actionName = String(formData.get('actionName'));
  const email = String(formData.get('email'));
  const otp = String(formData.get('otp'));
  const newPassword = String(formData.get('newPassword'));

  switch (actionName) {
    case 'forgot-password': {
      try {
        const data = emailSchema.parse({ email });
        const resp = await publicAPI.post('/security/forgot-password', cookie, {
          body: JSON.stringify(data),
        });

        if (resp.status === 200) {
          return { success: true };
        }

        const respData = await resp.json();

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
    case 'verify-otp': {
      try {
        const data = otpSchema.parse({ enteredOtpCode: otp });
        const resp = await publicAPI.post('/security/forgot-password/verify-otp', cookie, {
          body: JSON.stringify(data),
        });

        if (resp.status === 200) {
          return { success: true };
        }

        const respData = await resp.json();

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
    case 'new-password': {
      try {
        const data = passwordSchema.parse({ newPassword });
        const resp = await publicAPI.post('/security/forgot-password/reset', cookie, {
          body: JSON.stringify(data),
        });

        if (resp.status === 200) {
          return { success: true };
        }

        const respData = await resp.json();

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
    // No default
  }

  return null;
}
