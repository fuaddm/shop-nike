import { useState } from 'react';
import { Label } from 'react-aria-components';
import { useFetcher } from 'react-router';

import { CountryCombobox } from '@components/page/addresses/CountryCombobox';
import { StateCombobox } from '@components/page/addresses/StateCombobox';

export function CountryAndRegion({ state = '', propCountry = '' }: { state?: string; propCountry?: string }) {
  const fetcher = useFetcher({ key: 'address' });
  const [country, setCountry] = useState(propCountry);

  return (
    <div className="mb-4 grid grid-cols-2 gap-2">
      <div className="grid gap-1">
        <StateCombobox
          defaultValue={state}
          country={country}
        />
        {fetcher.data?.errors && fetcher.data?.errors.state && (
          <div className="text-red-600">{fetcher.data?.errors.state}</div>
        )}
      </div>
      <div className="grid gap-1">
        <Label htmlFor="country">Country*</Label>
        <CountryCombobox
          country={country}
          setCountry={setCountry}
        />
        {fetcher.data?.errors && fetcher.data?.errors.country && (
          <div className="text-red-600">{fetcher.data?.errors.country}</div>
        )}
      </div>
    </div>
  );
}
