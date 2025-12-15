import { EllipsisVertical } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from 'react-aria-components';
import { useFetcher } from 'react-router';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';

import { EditAddress } from '@components/page/addresses/EditAddress';

interface IAddressCardProperties {
  addressId: string;
  city: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  streetAddress: string;
  streetAddressSecond: string;
  zipCode: string;
  countryName: string;
  locationName: string;
  locationId: string;
  countryId: string;
}

export function AddressCard(properties: IAddressCardProperties) {
  const {
    addressId,
    firstName,
    lastName,
    city,
    phoneNumber,
    streetAddress,
    streetAddressSecond,
    zipCode,
    countryName,
    locationName,
  } = properties;

  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data?.success === false && fetcher.state === 'idle') {
      toast.error('Something went wrong');
    }
  }, []);

  function deleteAddress() {
    const formData = new FormData();
    formData.append('addressId', addressId);
    formData.append('actionType', 'delete');
    fetcher.submit(formData, {
      method: 'POST',
    });
  }

  return (
    <div className="bg-surface-container flex justify-between rounded-xl p-6">
      <div className="flex flex-col gap-2">
        <div className="font-medium">
          {firstName} {lastName}
        </div>
        <div className="text-on-surface-variant">{countryName}</div>
        <div className="text-on-surface-variant">{locationName}</div>
        <div className="text-on-surface-variant">{streetAddress}</div>
        {streetAddressSecond && <div className="text-on-surface-variant">{streetAddressSecond}</div>}
        <div className="text-on-surface-variant">{city}</div>
        <div className="text-on-surface-variant">{phoneNumber}</div>
        <div className="text-on-surface-variant">{zipCode}</div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="hover:bg-surface-container-high aspect-square h-fit rounded-full py-1 transition focus:outline-none">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 border-none"
          align="end"
        >
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <EditAddress data={properties} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button
                className="hover:bg-surface-container w-full text-red-500 hover:text-red-500"
                isDisabled={fetcher.state !== 'idle'}
                onPress={() => deleteAddress()}
              >
                Delete
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function SimpleAddressCard(properties: IAddressCardProperties) {
  const {
    firstName,
    lastName,
    city,
    phoneNumber,
    streetAddress,
    streetAddressSecond,
    zipCode,
    countryName,
    locationName,
  } = properties;

  return (
    <div className="bg-surface-container hover:bg-surface-container-high flex justify-between rounded-xl p-6 text-start transition ease-out">
      <div className="flex flex-col gap-2">
        <div className="font-medium">
          {firstName} {lastName}
        </div>
        <div className="text-on-surface-variant">
          {countryName}, {locationName}, {city}
        </div>
        <div className="text-on-surface-variant">{streetAddress}</div>
        {streetAddressSecond && <div className="text-on-surface-variant">{streetAddressSecond}</div>}
        <div className="text-on-surface-variant">{phoneNumber}</div>
        <div className="text-on-surface-variant">{zipCode}</div>
      </div>
    </div>
  );
}

export function SkeletonAddressCard() {
  return (
    <div className="bg-surface-container hover:bg-surface-container-high flex justify-between rounded-xl p-6 text-start text-transparent transition ease-out">
      <div className="flex flex-col gap-2">
        <div className="bg-on-surface w-fit animate-pulse rounded-md font-medium">firstName lastName</div>
        <div className="bg-on-surface-variant w-fit animate-pulse rounded-md">countryName, locationName, city</div>
        <div className="bg-on-surface-variant w-fit animate-pulse rounded-md">streetAddress streetAddress</div>
        <div className="bg-on-surface-variant w-fit animate-pulse rounded-md">streetAddress</div>
        <div className="bg-on-surface-variant w-fit animate-pulse rounded-md">phoneNumber</div>
        <div className="bg-on-surface-variant w-fit animate-pulse rounded-md">zipCode</div>
      </div>
    </div>
  );
}
