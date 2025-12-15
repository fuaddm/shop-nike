import { MonitorSmartphone, Moon, SunDim } from 'lucide-react';
import { Button } from 'react-aria-components';
import { useFetcher, useLoaderData } from 'react-router';
import type { loader } from '~/root';

import { cn } from '@libs/cn';

export function ThemeSwitch() {
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher({ key: 'theme' });
  const { theme } = loaderData;
  const optimisticTheme = fetcher.formData ? fetcher.formData.get('theme') : theme;

  return (
    <fetcher.Form
      action="/theme"
      method="POST"
      className="border-outline-variant flex w-fit rounded-full border"
    >
      <Button
        name="theme"
        type="submit"
        value=""
        isDisabled={optimisticTheme === ''}
        className={cn({
          'not-disabled:hover:bg-surface-container-high group grid aspect-square w-7 place-items-center rounded-full transition ease-out': true,
          'outline-outline-variant bg-surface-container-lowest/50 outline': optimisticTheme === '',
        })}
      >
        <MonitorSmartphone
          className={cn({
            'stroke-on-surface-variant/70 group-hover:stroke-on-surface w-3.5': true,
            'stroke-on-surface': optimisticTheme === '',
          })}
        />
      </Button>
      <Button
        name="theme"
        type="submit"
        value={'light'}
        isDisabled={optimisticTheme === 'light'}
        className={cn({
          'not-disabled:hover:bg-surface-container-high group grid aspect-square w-7 place-items-center rounded-full transition ease-out': true,
          'outline-outline-variant bg-surface-container-lowest/50 outline': optimisticTheme === 'light',
        })}
      >
        <SunDim
          className={cn({
            'stroke-on-surface-variant/70 group-hover:stroke-on-surface w-4': true,
            'stroke-on-surface': optimisticTheme === 'light',
          })}
        />
      </Button>
      <Button
        name="theme"
        type="submit"
        value={'dark'}
        isDisabled={optimisticTheme === 'dark'}
        className={cn({
          'not-disabled:hover:bg-surface-container-high group grid aspect-square w-7 place-items-center rounded-full transition ease-out': true,
          'outline-outline-variant bg-surface-container-lowest/50 outline': optimisticTheme === 'dark',
        })}
      >
        <Moon
          className={cn({
            'stroke-on-surface-variant/70 group-hover:stroke-on-surface w-3.5': true,
            'stroke-on-surface': optimisticTheme === 'dark',
          })}
        />
      </Button>
    </fetcher.Form>
  );
}
