import { useEffect } from 'react';

export function useLockBodyScroll(isOpen: boolean) {
  useEffect(() => {
    const body = document.body;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const isDesktop = window.matchMedia('(min-width: 769px)').matches;

    if (isOpen) {
      body.style.overflow = 'hidden';
      if (isDesktop && scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      body.style.overflow = '';
      body.style.paddingRight = '';
    }

    return () => {
      body.style.overflow = '';
      body.style.paddingRight = '';
    };
  }, [isOpen]);
}
