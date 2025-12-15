import type { ActionFunctionArgs } from 'react-router';
import { userCookie } from '~/cookies.server';

import { authAPI } from '@api/auth-api';

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};

  const formData = await request.formData();
  const name = formData.get('name');
  const surname = formData.get('surname');
  const phoneNumber = formData.get('phoneNumber');
  const state = formData.get('state');
  const country = formData.get('country');
  const city = formData.get('city');
  const zipCode = formData.get('zipCode');
  const birthDate = new Date(String(formData.get('birthDate'))).toISOString();

  try {
    const resp = await authAPI.put('/user/profile', cookie, {
      body: JSON.stringify({
        name,
        surname,
        countryId: country,
        locationId: state,
        city,
        zipCode,
        phoneNumber,
        birth_date: birthDate,
      }),
    });

    if (resp.status === 200) {
      return { success: true };
    } else {
      const errorBody = await resp.text();
      console.log('Error Body (Text):', errorBody);
    }
    return { success: false };
  } catch {
    return { success: false };
  }
}
