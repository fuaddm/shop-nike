import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type ShouldRevalidateFunction,
  redirect,
  useRouteLoaderData,
} from 'react-router';
import { userContext } from '~/context/user-context';
import { userCookie } from '~/cookies.server';

import { CartItem } from '@components/page/cart/CartItem';
import { Summary } from '@components/page/cart/Summary';

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

  const formData = await request.formData();
  const cartItemId = String(formData.get('cartItemId'));
  const quantity = String(formData.get('quantity'));
  const actionName = String(formData.get('actionName'));
  const promocode = String(formData.get('promocode'));

  if (actionName === 'update-item-quantity') {
    const searchParams = new URLSearchParams({
      cartItemId,
      quantity,
    });

    const resp = await authAPI.post(`/user/update-cart-item-quantity?${searchParams.toString()}`, cookie);
    const data = await resp.json();

    if (data.result.status === false) {
      return { success: false };
    }
    return { success: true };
  } else if (actionName === 'promocode') {
    const resp = await authAPI.post(`/user/validate-promo-code?promoCodeId=${promocode}`, cookie);
    const data = await resp.json();

    console.log(data);

    if (data.result.status === false) {
      return { success: false, errorMsg: data.result.errorMsg };
    }
    return { success: true, promocode };
  }

  return { success: false };
}

export default function BasketPage() {
  const { cart } = useRouteLoaderData('root');

  return (
    <div className="container pt-12 pb-20">
      <div className="mb-12 text-center text-3xl font-semibold">Basket</div>
      <div className="grid grid-cols-[1fr_450px] gap-6">
        <div className="flex flex-col gap-2">
          {cart.data.map((product) => {
            return (
              <CartItem
                key={product.cart_item_id}
                id={product.cart_item_id}
                variationCode={product.product_variation_id}
                name={product.product_name}
                category={product.main_category}
                color={product.color}
                price={product.price}
                size={product.size}
                quantity={product.quantity}
                img={product.first_image}
              />
            );
          })}
          {cart.data.length === 0 && (
            <div className="mb-12 grid w-full place-items-center pt-10">
              <img
                src="/svg/Empty Cart.svg"
                className="aspect-square w-50"
              />
            </div>
          )}
        </div>
        <div>
          <Summary />
        </div>
      </div>
    </div>
  );
}
