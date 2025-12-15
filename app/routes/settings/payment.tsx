import { useEffect } from 'react';
import { redirect, useFetcher, useLoaderData } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';
import { userContext } from '~/context/user-context';
import { userCookie } from '~/cookies.server';

import { AddNewCard } from '@components/page/payment/AddNewCard';
import { CreditCard } from '@components/page/payment/CreditCard';

import { paymentSchema } from '@models/creditCard';

import { authAPI } from '@api/auth-api';
import { mainAPI } from '@api/config';

import type { Route } from '.react-router/types/app/routes/settings/+types/payment';

export async function loader({ request, context }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};

  const user = context.get(userContext);
  if (!user?.isAuth) {
    return redirect('/');
  }

  const resp = await authAPI.get('/user/bank-card', cookie, {
    headers: {
      token: cookie.privateToken,
    },
  });

  const respData = await resp.json();

  return respData;
}

export async function action({ request }: Route.ActionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};

  const formData = await request.formData();
  const actionType = String(formData.get('actionType'));
  const creditCardId = String(formData.get('creditCardId'));
  const cardNumber = String(formData.get('card-number')).split('-').join('');
  const fullName = String(formData.get('full-name'));
  const expirationDate = String(formData.get('expiration-date'));

  const [cardHolderName, cardHolderSurname] = fullName.split(' ');
  const rawData = {
    cardNumber,
    cardHolderName,
    cardHolderSurname: cardHolderSurname ?? '',
    expirationDate,
  };

  if (actionType === 'add') {
    try {
      const parsedData = paymentSchema.parse(rawData);
      await mainAPI.post(
        '/user/add-bank-card',
        {
          ...parsedData,
          cvv: '123',
        },
        {
          headers: {
            token: cookie.privateToken,
          },
        }
      );

      return { success: true };
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
    }
  } else if (actionType === 'delete') {
    try {
      await mainAPI.patch(`/user/delete-bank-card?bankCardId=${creditCardId}`, null, {
        headers: {
          token: cookie.privateToken,
        },
      });

      return { success: true };
    } catch {
      return { success: false };
    }
  }
  return { success: false };
}

export default function PaymentPage() {
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher({ key: 'delete-credit-card' });

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.success === true) {
      toast.success('Removed successfully');
    } else if (fetcher.state === 'idle' && fetcher.data?.success === false) {
      toast.error('Something went wrong. Please, try again');
    }
  }, [fetcher]);

  function deleteCreditCard(id: string) {
    const formData = new FormData();
    formData.set('actionType', 'delete');
    formData.set('creditCardId', id);
    fetcher.submit(formData, {
      method: 'POST',
    });
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {loaderData.data?.map((card) => {
        return (
          <CreditCard
            key={card.id}
            deleteCreditCard={() => deleteCreditCard(card.id)}
            cardType={card.cardType}
            fullName={card.fullName}
            cardNumber={card.number}
          />
        );
      })}
      <AddNewCard />
    </div>
  );
}
