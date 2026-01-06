import type { ActionFunctionArgs } from 'react-router';
import { z } from 'zod';
import { userCookie } from '~/cookies.server';

import { authAPI } from '@api/auth-api';

// 1. Ensure your schema covers the basic text inputs
export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional().or(z.literal('')),
  surname: z.string().min(2, 'Surname must be at least 2 characters').optional().or(z.literal('')),
  birthDate: z
    .string()
    .date('Invalid date format')
    .refine(
      (dateString) => {
        const birthDate = new Date(dateString);
        const today = new Date();

        // Calculate age
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        // Adjust if birthday hasn't happened yet this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        return age >= 18;
      },
      { message: 'You must be at least 18 years old' }
    )
    .optional()
    .or(z.literal('')),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  city: z.string().min(2).optional().or(z.literal('')),
  zipCode: z.string().min(3).optional().or(z.literal('')),
});

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};

  // 2. Extract raw data
  const formData = await request.formData();
  const rawData = Object.fromEntries(formData);

  // 3. Validate with Zod
  const validation = profileSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { data } = validation;

  // 4. Safe Date Transformation
  // Prevents "RangeError: Invalid time value" if birthDate is empty
  let formattedBirthDate = null;
  if (data.birthDate) {
    try {
      formattedBirthDate = new Date(data.birthDate).toISOString();
    } catch (e) {
      console.error('Date parsing error:', e);
    }
  }

  // 5. API Call
  try {
    const resp = await authAPI.put('/user/profile', cookie, {
      body: JSON.stringify({
        name: data.name,
        surname: data.surname,
        // These fields are extracted directly from formData since they weren't in the schema
        countryId: rawData.country,
        locationId: rawData.state,
        city: data.city,
        zipCode: data.zipCode,
        phoneNumber: data.phoneNumber,
        birth_date: formattedBirthDate,
      }),
    });

    if (resp.status === 200) {
      return { success: true };
    } else {
      const errorBody = await resp.text();
      console.log('Error Body (Text):', errorBody);
      // Optional: Parse API error to return specific messages if available
      return { success: false, apiError: errorBody };
    }
  } catch (error) {
    console.error('Network/API Error:', error);
    return { success: false };
  }
}
