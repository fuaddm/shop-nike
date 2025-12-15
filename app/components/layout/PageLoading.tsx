import { useNavigation, useNavigationType } from 'react-router';

import { cn } from '@libs/cn';

export function PageLoading() {
  const navigationType = useNavigationType();
  const navigation = useNavigation();

  const isLoading = navigation.state === 'loading' && navigationType !== 'REPLACE';

  return (
    <div
      className={cn({
        'fixed top-0 left-0 z-1000 h-2 w-full -translate-x-full bg-blue-600 opacity-0 transition duration-1000 ease-in-out': true,
        'translate-x-0 opacity-100': isLoading,
      })}
    ></div>
  );
}
