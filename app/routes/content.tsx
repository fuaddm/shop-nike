import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { userContext } from '~/context/user-context';
import { userCookie } from '~/cookies.server';

import { MarkdownImage } from '@ui/MarkdownImage';

import { authAPI } from '@api/auth-api';
import { publicAPI } from '@api/public-api';

import type { Route } from '.react-router/types/app/routes/+types/content';

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userCookie.parse(cookieHeader)) || {};

  const user = context.get(userContext);

  const name = params.name;

  try {
    if (user?.isAuth) {
      const resp = await authAPI.get(`/help/content?name=${name}`, cookie);
      const data = await resp.json();
      return data.data;
    } else {
      const resp = await publicAPI.get(`/help/content?name=${name}`, cookie);
      const data = await resp.json();
      return data.data;
    }
  } catch {
    return { success: false };
  }
}

export default function Content({ loaderData }: Route.ComponentProps) {
  return (
    <div className="container pt-12">
      {(loaderData?.success === false || !loaderData) && (
        <div className="py-10 text-center">
          <div className="mb-6 text-6xl font-semibold">404</div>
          <div className="text-4xl font-semibold">This page not found</div>
        </div>
      )}
      {loaderData && (
        <div>
          <div className="mb-6 text-center text-5xl font-bold uppercase">{loaderData.title}</div>
          <div className="markdown-body">
            <Markdown
              components={{
                img: MarkdownImage,
              }}
              remarkPlugins={[remarkGfm]}
            >
              {loaderData.content}
            </Markdown>
          </div>
        </div>
      )}
    </div>
  );
}
