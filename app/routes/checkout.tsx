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

import { SimpleAddressCard, SkeletonAddressCard } from '@components/page/addresses/AddressCard';
import { SimpleCartItem } from '@components/page/cart/CartItem';
import { SimpleSummary } from '@components/page/cart/Summary';
import { SimpleCreditCard, SkeletonCreditCard } from '@components/page/payment/CreditCard';

import { cn } from '@libs/cn';

import { authAPI } from '@api/auth-api';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};
  const promoCodeId = new URL(request.url).searchParams.get('promocode');

  const user = context.get(userContext);
  if (!user?.isAuth) {
    return redirect('/');
  } else {
    if (promoCodeId) {
      const resp = await authAPI.get(`/user/total-price?promoCodeId=${promoCodeId}`, cookie);
      const data = await resp.json();
      return data;
    } else {
      const resp = await authAPI.get('/user/total-price', cookie);
      const data = await resp.json();
      return data;
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
  const promoCodeId = String(url.searchParams.get('promocode'));

  const searchParams = new URLSearchParams({
    bankCardId,
    addressId,
    promoCodeId,
  });

  const resp = await authAPI.post(`/user/checkout?${searchParams.toString()}`, cookie);
  const data = await resp.json();

  if (data.result.status === false) {
    return { success: false, errorMsg: data.result.errorMsg };
  }

  return redirect('/');
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
      <div className="grid grid-cols-[1fr_450px] gap-6">
        <div>
          <div className="mb-12 text-center text-3xl font-semibold">Checkout</div>
          <div className="mb-3 flex flex-col gap-4">
            <div className="text-xl font-medium">Delivery</div>
            <div className="mb-4 grid grid-cols-2 gap-3">
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
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-xl font-medium">Saved payment methods</div>
            <div className="mb-4 grid w-fit grid-cols-1 gap-3">
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
            </div>
          </div>
        </div>
        <div>
          <SimpleSummary />
          <Button
            onPress={submitOrder}
            className="bg-primary text-on-primary hover:bg-primary/80 mt-4 w-full rounded-xl px-12 py-4 text-lg font-medium transition ease-out"
          >
            Order
          </Button>
          <div className="mt-4 flex flex-col gap-2">
            {cart.data.map((item) => {
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
