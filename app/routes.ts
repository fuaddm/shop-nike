import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('product/:variationCode', 'routes/product.tsx'),
  route('login', 'routes/login.tsx'),
  route('logout', 'routes/logout.tsx'),
  route('signup', 'routes/signup.tsx'),
  route('forgot-password', 'routes/forgot-password.tsx'),
  route('favourites', 'routes/favourites.tsx'),
  route('basket', 'routes/basket.tsx'),
  route('review', 'routes/review.tsx'),
  route('products-data', 'routes/products-data.tsx'),
  route('products', 'routes/products-home.tsx'),
  route('theme', 'routes/theme.tsx'),
  route('favourites-data', 'routes/favourites-data.tsx'),
  route('checkout', 'routes/checkout.tsx'),
  route('page/:name', 'routes/content.tsx'),
  route('settings', './routes/settings/layout.tsx', [
    index('./routes/settings/my-profile.tsx'),
    route('payment', './routes/settings/payment.tsx'),
    route('addresses', 'routes/settings/addresses.tsx'),
    route('orders', 'routes/settings/orders.tsx'),
    route('edit-my-profile', 'routes/settings/edit-my-profile.tsx'),
    route('delete-my-profile', 'routes/settings/delete-my-profile.tsx'),
  ]),
] satisfies RouteConfig;
