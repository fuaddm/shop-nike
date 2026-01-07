import { useQueryState } from 'nuqs';
import { useEffect } from 'react';
import { Button } from 'react-aria-components';
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type ShouldRevalidateFunction,
  redirect,
  useFetcher,
  useRouteLoaderData,
} from 'react-router';
import { toast } from 'sonner';
import { userContext } from '~/context/user-context';
import { userCookie } from '~/cookies.server';

import { AddNewAddress } from '@components/page/addresses/AddNewAddress';
import { SimpleAddressCard, SkeletonAddressCard } from '@components/page/addresses/AddressCard';
import { SimpleCartItem } from '@components/page/cart/CartItem';
import { SimpleSummary } from '@components/page/cart/Summary';
import { AddNewCard } from '@components/page/payment/AddNewCard';
import { SimpleCreditCard, SkeletonCreditCard } from '@components/page/payment/CreditCard';

import { cn } from '@libs/cn';

import { authAPI } from '@api/auth-api';
import { mainAPI } from '@api/config';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};
  const promoCodeId = new URL(request.url).searchParams.get('promocode');

  const user = context.get(userContext);
  if (!user?.isAuth) {
    return redirect('/');
  } else {
    const countryAndRegionResp = await mainAPI.get('/user/countries_and_regions', {
      headers: {
        token: cookie.privateToken,
      },
    });
    if (promoCodeId) {
      const resp = await authAPI.get(`/user/total-price?promoCodeId=${promoCodeId}`, cookie);
      const data = await resp.json();
      return { summary: data, countriesAndRegions: countryAndRegionResp.data.data };
    } else {
      const resp = await authAPI.get('/user/total-price', cookie);
      const data = await resp.json();
      return { summary: data, countriesAndRegions: countryAndRegionResp.data.data };
    }
  }
}

export const shouldRevalidate: ShouldRevalidateFunction = ({ formAction }) => {
  if (formAction === '/theme') return false;
  return true;
};

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};

  const url = new URL(request.url);

  const bankCardId = String(url.searchParams.get('cardId'));
  const addressId = String(url.searchParams.get('addressId'));
  const promoCodeId = url.searchParams.get('promocode');

  const resp = await authAPI.post(`/user/checkout`, cookie, {
    body: JSON.stringify({
      bankCardId,
      addressId,
      promoCodeId,
    }),
  });
  const data = await resp.json();

  if (data?.result?.status === false) {
    return { success: false, errorMsg: data.result.errorMsg };
  }

  return redirect('/settings/orders');
}

export default function CheckoutPage() {
  const { cart } = useRouteLoaderData('root');

  const addressFetcher = useFetcher();
  const paymentFetcher = useFetcher();
  const checkoutFetcher = useFetcher();
  const [addressId, setAddressId] = useQueryState('addressId', { shallow: false });
  const [cardId, setCardId] = useQueryState('cardId', { shallow: false });

  useEffect(() => {
    addressFetcher.load('/settings/addresses');
    paymentFetcher.load('/settings/payment');
  }, []);

  function submitOrder() {
    checkoutFetcher.submit('', {
      method: 'POST',
    });
  }

  const loading = checkoutFetcher.state !== 'idle';

  useEffect(() => {
    if (checkoutFetcher.state === 'idle' && checkoutFetcher.data) {
      if (checkoutFetcher.data.success === false) {
        toast.error(checkoutFetcher.data.errorMsg);
      } else {
        toast.success('Checkout Complete');
      }
    }
  }, [checkoutFetcher]);

  return (
    <div className="container pt-12 pb-20">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_450px]">
        <div>
          <div className="mb-12 text-center text-3xl font-semibold">Checkout</div>
          <div className="mb-3 flex flex-col gap-4">
            <div className="text-xl font-medium">Delivery</div>
            <div className="mb-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
              {addressFetcher.data?.addresses &&
                addressFetcher.data.addresses.map((address) => {
                  return (
                    <Button
                      onPress={() => setAddressId(address.address_id)}
                      key={address.address_id}
                      className={cn({
                        'rounded-xl outline-2 outline-transparent transition ease-out': true,
                        'outline-on-surface outline-2': addressId === address.address_id,
                      })}
                    >
                      <SimpleAddressCard
                        city={address.city}
                        countryName={address.country_name}
                        locationName={address.location_name}
                        firstName={address.first_name}
                        lastName={address.last_name}
                        phoneNumber={address.phone_number}
                        streetAddress={address.street_address}
                        streetAddressSecond={address.street_address_second}
                        zipCode={address.zip_code}
                      />
                    </Button>
                  );
                })}
              {!addressFetcher.data?.addresses && (
                <>
                  <SkeletonAddressCard />
                  <SkeletonAddressCard />
                </>
              )}
              <AddNewAddress />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-xl font-medium">Saved payment methods</div>
            <div className="mb-4 grid w-fit grid-cols-1 items-start gap-3 md:grid-cols-2">
              {paymentFetcher.data?.data &&
                paymentFetcher.data.data.map((card) => {
                  return (
                    <Button
                      onPress={() => setCardId(card.id)}
                      key={card.id}
                      className={cn({
                        'rounded-xl outline-2 outline-transparent transition ease-out': true,
                        'outline-on-surface outline-2': cardId === card.id,
                      })}
                    >
                      <SimpleCreditCard
                        key={card.id}
                        cardType={card.cardType}
                        cardNumber={card.number}
                      />
                    </Button>
                  );
                })}

              {!paymentFetcher.data?.data && (
                <>
                  <SkeletonCreditCard cardType="Visa" />
                  <SkeletonCreditCard cardType="Mastercard" />
                </>
              )}
              <AddNewCard isCheckout={true} />
            </div>
          </div>
        </div>
        <div>
          <SimpleSummary />
          <Button
            onPress={submitOrder}
            isDisabled={loading}
            className="bg-primary text-on-primary not-disabled:hover:bg-primary/80 relative mt-4 w-full overflow-hidden rounded-xl px-12 py-4 text-lg font-medium transition ease-out"
          >
            Order
            {loading && (
              <div className="bg-primary-fixed absolute top-0 left-0 z-10 grid h-full w-full place-items-center py-3">
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
          </Button>
          <div className="mt-4 flex flex-col gap-2">
            {cart.data.items.map((item) => {
              return (
                <SimpleCartItem
                  key={item.cart_item_id}
                  id={item.cart_item_id}
                  img={item.first_image}
                  color={item.color}
                  category={item.main_category}
                  price={item.price}
                  quantity={item.quantity}
                  name={item.product_name}
                  size={item.size}
                  variationCode={item.product_variation_id}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
