import { z } from 'zod';

import { isFutureExpirationDate } from '@libs/date';

export const paymentSchema = z.object({
  // 1. Card Number: String, between 13 and 19 digits (standard range for major cards).
  cardNumber: z
    .string()
    .min(13, { message: 'Card number must be at least 13 digits.' })
    .max(19, { message: 'Card number cannot exceed 19 digits.' })
    .regex(/^[0-9]+$/, { message: 'Card number must contain only digits.' }),

  // 2. Card Holder Name: Non-empty string.
  cardHolderName: z.string().min(2, { message: 'Card holder name must be provided.' }).trim(),

  // 3. Card Holder Surname: String. Allowed to be an empty string, as per your usage logic.
  cardHolderSurname: z.string().trim(),

  // 4. Expiration Date: MM/YY format and must be a future date.
  expirationDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Expiration date must be in MM/YY format (e.g., 12/26).' })
    .refine(isFutureExpirationDate, {
      message: "The card's expiration date must be in the future.",
    }),
});

export type PaymentData = z.infer<typeof paymentSchema>;
