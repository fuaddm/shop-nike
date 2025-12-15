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
    } else if (fetcher.state === 'idle' && fetcher.data?.success === false) {
      toast.error('Something went wrong. Please try again');
    }
  }, [fetcher]);

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
        </div>
        <div className="grid gap-1">
          <Label>Surname</Label>
          <Input
            name="surname"
            defaultValue={userData?.data?.surname}
            placeholder="Optional"
            className="bg-surface-container rounded-md px-3 py-2 font-mono focus:outline-none"
          />
        </div>
        <div className="grid gap-1">
          <Label>Birth Date</Label>
          <Input
            type="date"
            name="birthDate"
            defaultValue={userData?.data?.birth_date.slice(0, 10)}
            placeholder="Optional"
            className="bg-surface-container rounded-md px-3 py-2 font-mono focus:outline-none"
          />
        </div>
        <div className="grid gap-1">
          <Label>Phone number</Label>
          <Input
            name="phoneNumber"
            defaultValue={userData?.data?.phone_number}
            placeholder="Optional"
            className="bg-surface-container rounded-md px-3 py-2 font-mono focus:outline-none"
          />
        </div>
        <div className="grid gap-1">
          <Label>City</Label>
          <Input
            name="city"
            defaultValue={userData?.data?.City}
            placeholder="Optional"
            className="bg-surface-container rounded-md px-3 py-2 font-mono focus:outline-none"
          />
        </div>
        <div className="grid gap-1">
          <Label>Zip code</Label>
          <Input
            name="zipCode"
            defaultValue={userData?.data?.Postcode}
            placeholder="Optional"
            className="bg-surface-container rounded-md px-3 py-2 font-mono focus:outline-none"
          />
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
          className="w-fit rounded-md py-2 transition hover:opacity-60"
        >
          Edit
        </PrimaryButton>
      </fetcher.Form>
    </div>
  );
}
