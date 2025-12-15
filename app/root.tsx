import { Footer } from '@layout/Footer';
import { Header } from '@layout/Header';
import { PageLoading } from '@layout/PageLoading';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { useEffect } from 'react';
import {
  Links,
  type LoaderFunctionArgs,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useFetcher,
  useLoaderData,
} from 'react-router';
import { Toaster } from 'sonner';
import 'swiper/css';
import { userContext } from '~/context/user-context';
import { themeCookie, userCookie } from '~/cookies.server';

import { AuthModal } from '@components/modals/AuthModal';

import { useUserStore } from '@stores/userStore';

import { authAPI } from '@api/auth-api';
import { publicAPI } from '@api/public-api';

import type { Route } from './+types/root';
import './app.css';
import { authMiddleware } from './middlewares/auth-middleware';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Fugaz+One&display=swap',
  },
  {
    rel: 'icon',
    type: 'image/svg+xml',
    href: '/logo.svg',
  },
];

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ request, context }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};
  const cookieOfTheme = (await themeCookie.parse(cookieHeader)) || {};

  const user = context.get(userContext);
  let favourites, cart;
  let hierarchy;

  const theme = cookieOfTheme.theme ?? '';

  if (user?.isAuth) {
    const resp = await authAPI.get('/user/favorites', cookie);
    const data = await resp.json();
    favourites = data;
    const cartResp = await authAPI.get('/user/cart', cookie);
    const cartData = await cartResp.json();
    cart = cartData;
    const hierarchyResp = await authAPI.get('/admin/hierarchy-v2', cookie);
    const hierarchyData = await hierarchyResp.json();
    hierarchy = hierarchyData;
  } else {
    const hierarchyResp = await publicAPI.get('/admin/hierarchy-v2', cookie);
    const hierarchyData = await hierarchyResp.json();
    hierarchy = hierarchyData;
  }

  console.log('cookie:', cookie);

  return { user, favourites, hierarchy, cart, theme };
}

export function meta() {
  return [
    { title: 'Nike' },
    {
      name: 'description',
      content: 'This app is the best',
    },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<typeof loader>();
  const setUserData = useUserStore((state) => state.setUserData);
  const fetcher = useFetcher({ key: 'theme' });
  const optimisticTheme = fetcher.formData ? fetcher.formData.get('theme') : loaderData.theme;

  // if (typeof document !== 'undefined') {
  //   console.log(loaderData);
  // }

  useEffect(() => {
    if (loaderData && loaderData.user && loaderData.user.isAuth && loaderData.user.userData) {
      setUserData(loaderData.user.userData);
    } else {
      setUserData(null);
    }
  }, [loaderData]);

  return (
    <html
      lang="en"
      className={optimisticTheme}
    >
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen">
        <NuqsAdapter>
          <PageLoading />
          <Header />
          <AuthModal />
          {children}
          <Toaster
            position="top-right"
            richColors
          />
          <Footer />
        </NuqsAdapter>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    console.log(error);
    message = error.status === 404 ? '404' : 'Error';
    details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
