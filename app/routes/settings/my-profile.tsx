import { useEffect } from 'react';
import { Input, Label } from 'react-aria-components';
import { redirect, useFetcher, useLoaderData } from 'react-router';
import { toast } from 'sonner';
import { userContext } from '~/context/user-context';
import { userCookie } from '~/cookies.server';

import { PrimaryButton } from '@ui/button/PrimaryButton';

import { DeleteAccount } from '@components/page/account/DeleteAccount';
import { CountryAndRegion } from '@components/page/addresses/CountryAndRegion';

import { mainAPI } from '@api/config';
import { publicAPI } from '@api/public-api';

import type { Route } from '.react-router/types/app/routes/settings/+types/my-profile';

export async function loader({ request, context }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};

  const user = context.get(userContext);
  if (!user?.isAuth) {
    return redirect('/');
  }

  const userResp = await publicAPI.get('/user/info', cookie, {
    headers: {
      key: process.env.PLATFORM_KEY ?? '',
      token: cookie.privateToken,
    },
  });

  const userData = await userResp.json();

  const resp = await mainAPI.get('/user/countries_and_regions', {
    headers: {
      token: cookie.privateToken,
    },
  });

  return { countriesAndRegions: resp.data.data, userData };
}

export default function MyProfile() {
  const loaderData = useLoaderData();
  const { userData } = loaderData;

  const fetcher = useFetcher({ key: 'profile' });
  const loading = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.success) {
      toast.success('Changed successfully');
    } else if (fetcher.state === 'idle' && fetcher.data?.success === false && !fetcher.data?.errors) {
      toast.error('Something went wrong. Please try again');
    }
  }, [fetcher]);

  const errors = fetcher.data?.success === false ? fetcher.data?.errors : undefined;

  return (
    <div>
      <fetcher.Form
        action="/settings/edit-my-profile"
        method="POST"
        className="flex flex-col gap-4"
      >
        <div className="grid gap-1">
          <Label>Email</Label>
          <Input
            disabled={true}
            value={userData?.data?.email}
            className="bg-surface-container rounded-md px-3 py-2 font-mono opacity-60 focus:outline-none"
          />
        </div>
        <div className="grid gap-1">
          <Label>Name</Label>
          <Input
            name="name"
            defaultValue={userData?.data?.name}
            placeholder="Optional"
            className="bg-surface-container rounded-md px-3 py-2 font-mono focus:outline-none"
          />
          <FieldError message={errors?.name} />
        </div>
        <div className="grid gap-1">
          <Label>Surname</Label>
          <Input
            name="surname"
            defaultValue={userData?.data?.surname}
            placeholder="Optional"
            className="bg-surface-container rounded-md px-3 py-2 font-mono focus:outline-none"
          />
          <FieldError message={errors?.surname} />
        </div>
        <div className="grid gap-1">
          <Label>Birth Date</Label>
          <Input
            type="date"
            name="birthDate"
            defaultValue={userData?.data?.birth_date?.slice(0, 10)}
            placeholder="Optional"
            className="bg-surface-container rounded-md px-3 py-2 font-mono focus:outline-none"
          />
          <FieldError message={errors?.birthDate} />
        </div>
        <div className="grid gap-1">
          <Label>Phone number</Label>
          <Input
            name="phoneNumber"
            defaultValue={userData?.data?.phone_number}
            placeholder="Optional"
            className="bg-surface-container rounded-md px-3 py-2 font-mono focus:outline-none"
          />
          <FieldError message={errors?.phoneNumber} />
        </div>
        <div className="grid gap-1">
          <Label>City</Label>
          <Input
            name="city"
            defaultValue={userData?.data?.City}
            placeholder="Optional"
            className="bg-surface-container rounded-md px-3 py-2 font-mono focus:outline-none"
          />
          <FieldError message={errors?.city} />
        </div>
        <div className="grid gap-1">
          <Label>Zip code</Label>
          <Input
            name="zipCode"
            defaultValue={userData?.data?.Postcode}
            placeholder="Optional"
            className="bg-surface-container rounded-md px-3 py-2 font-mono focus:outline-none"
          />
          <FieldError message={errors?.zipCode} />
        </div>
        <CountryAndRegion
          state={userData?.data?.location_id}
          propCountry={userData?.data?.country_id}
        />
        <div className="border-outline-variant flex items-center justify-between border-y py-6">
          <div>Delete Account</div>
          <DeleteAccount />
        </div>
        <PrimaryButton
          type="submit"
          isDisabled={loading}
          className="relative w-fit overflow-hidden rounded-md py-2 transition not-disabled:hover:opacity-60"
        >
          Edit
          {loading && (
            <div className="bg-primary-fixed absolute top-0 left-0 z-10 grid h-full w-full place-items-center py-2.5">
              <svg
                aria-hidden="true"
                className="fill-on-primary aspect-square h-full animate-spin text-transparent"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </PrimaryButton>
      </fetcher.Form>
    </div>
  );
}

const FieldError = ({ message }: { message?: string[] | string }) => {
  if (!message) return null;
  return <p className="text-error mt-1 text-xs">{Array.isArray(message) ? message[0] : message}</p>;
};
