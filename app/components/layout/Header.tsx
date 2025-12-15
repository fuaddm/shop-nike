import { Menu } from '@layout/Menu';
import { UserButton } from '@layout/UserButton';
import { Heart, Menu as MenuIcon, ShoppingCartIcon } from 'lucide-react';
import { type MouseEvent, useEffect, useRef, useState } from 'react';
import { Button } from 'react-aria-components';
import { Link, useLoaderData } from 'react-router';
import type { loader } from '~/root';

import { Logo } from '@components/page/shared/Logo';

import { useAuthModalStore } from '@stores/authModalStore';
import { useMenuStore } from '@stores/menuStore';

import { ConverseIcon } from '@icons/ConverseIcon';
import { JordanIcon } from '@icons/JordanIcon';

import { cn } from '@libs/cn';

export function Header() {
  const loaderData = useLoaderData<typeof loader>();
  const isAuth = loaderData.user?.isAuth;
  const cartCount = loaderData.cart?.data.length ?? 0;

  const setIsOpen = useMenuStore((state) => state.setIsOpen);
  const isOpen = useMenuStore((state) => state.isOpen);
  const [selectedMainCategory, setSelectedMainCategoryId] = useState<number | null>(null);
  const isAuthModalOpen = useAuthModalStore((state) => state.isOpen);
  const setIsAuthModalOpen = useAuthModalStore((state) => state.setIsOpen);

  const menuReference = useRef<HTMLDivElement | null>(null);
  const navReference = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
      if (document.body.offsetWidth > 768) {
        document.body.style.paddingRight = '15px';
      }
    } else {
      setTimeout(() => {
        document.body.style.overflow = '';
        if (document.body.offsetWidth > 768) {
          document.body.style.paddingRight = '0px';
        }
      }, 150);
    }
  }, [isAuthModalOpen]);

  function mouseOut(element: MouseEvent<HTMLDivElement>) {
    if (
      element.relatedTarget instanceof Node &&
      (menuReference.current?.contains(element.relatedTarget) ||
        menuReference.current === element.relatedTarget ||
        navReference.current === element.relatedTarget ||
        navReference.current?.contains(element.relatedTarget))
    ) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }

  return (
    <div className="relative mb-18">
      <div className="container py-1.5">
        <div className="flex justify-between">
          <div className="flex gap-4">
            <Link
              className="group"
              to="/products?MainCategoryId=11&CategoryId=13&SubCategoryId=1022"
            >
              <JordanIcon className="group-hover:fill-on-surface-variant fill-on-surface aspect-square h-6" />
            </Link>
            <Link
              className="group"
              to="/products?MainCategoryId=11&CategoryId=13&SubCategoryId=1020"
            >
              <ConverseIcon className="group-hover:fill-on-surface-variant fill-on-surface aspect-square h-6" />
            </Link>
          </div>
          <div className="flex items-center gap-x-4">
            <Link
              to="/page/get-help"
              className="hover:text-on-surface-variant"
            >
              Help
            </Link>
            <div className="bg-outline-variant h-[16px] w-px"></div>
            <Link
              to="/page/contact-us"
              className="hover:text-on-surface-variant"
            >
              Join Us
            </Link>
            {!isAuth && (
              <>
                <div className="bg-outline-variant h-[16px] w-px"></div>
                <Button
                  className="cursor-pointer"
                  onPress={() => setIsAuthModalOpen(true)}
                >
                  Sign in
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div
        className={cn({
          'bg-surface-container-low w-full': true,
        })}
      >
        <div className="bg-surface-container-low container grid grid-cols-2 items-center gap-16 py-3 lg:grid-cols-3 lg:py-0">
          <Logo />
          <div
            ref={navReference}
            onMouseOut={mouseOut}
            className="relative z-0 hidden h-[72px] w-fit items-center justify-center justify-self-center lg:flex"
          >
            {loaderData.hierarchy &&
              loaderData.hierarchy.data.hierarchies.map((mainCategory) => {
                return (
                  <Link
                    onMouseEnter={() => {
                      setIsOpen(true);
                      setSelectedMainCategoryId(mainCategory.id);
                    }}
                    key={mainCategory.id}
                    to={`/products?MainCategoryId=${mainCategory.id}`}
                    className="flex h-full items-center px-3 decoration-2 underline-offset-8 hover:underline"
                  >
                    {mainCategory.name}
                  </Link>
                );
              })}
          </div>
          <div className="flex items-center justify-end gap-3">
            {isAuth && (
              <Link
                to="/basket"
                className="bg-surface-bright relative grid place-content-center rounded-full p-3"
              >
                <ShoppingCartIcon className="stroke-on-surface-variant aspect-square w-6" />
                {cartCount !== 0 && (
                  <div className="bg-tertiary text-on-tertiary absolute -top-2 -right-2 rounded-full px-2.5 py-0.5 text-sm">
                    {cartCount}
                  </div>
                )}
              </Link>
            )}
            {isAuth && (
              <Link
                to="/favourites"
                className="bg-surface-bright relative grid place-content-center rounded-full p-3"
              >
                <Heart className="stroke-on-surface-variant aspect-square w-6" />
                {loaderData.favourites.data.totalCount !== 0 && (
                  <div className="bg-tertiary text-on-tertiary absolute -top-2 -right-2 rounded-full px-2.5 py-0.5 text-sm">
                    {loaderData.favourites.data.totalCount}
                  </div>
                )}
              </Link>
            )}
            <UserButton />
            <Button
              onPress={() => setIsOpen((previous) => !previous)}
              className={cn({
                'bg-surface-bright block aspect-square rounded-full p-3 transition lg:hidden': true,
                '-rotate-90': isOpen,
              })}
            >
              <MenuIcon className="stroke-on-surface-variant aspect-square w-6" />
            </Button>
          </div>
        </div>
        <Menu
          ref={menuReference}
          selectedMainCategoryId={selectedMainCategory}
          mouseOut={mouseOut}
        />
      </div>
      <Link
        to="/page/cyber"
        className="absolute top-full left-0 z-10 w-full overflow-hidden py-4"
      >
        <div className="absolute top-0 left-0 h-full w-full">
          <img
            className="h-full w-full object-cover"
            src="/images/subheader.avif"
            alt=""
          />
        </div>
        <div className="relative z-10 container">
          <div className="flex items-center justify-between">
            <div className="text-xl font-medium text-white">CYBER MONDAY</div>
            <div className="text-xl font-medium text-white">EXTRA 25% OFF SELECT STYLES</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-14 fill-white"
              viewBox="135.5 361.38 1000 356.39"
            >
              <path d="M245.8075 717.62406c-29.79588-1.1837-54.1734-9.3368-73.23459-24.4796-3.63775-2.8928-12.30611-11.5663-15.21427-15.2245-7.72958-9.7193-12.98467-19.1785-16.48977-29.6734-10.7857-32.3061-5.23469-74.6989 15.87753-121.2243 18.0765-39.8316 45.96932-79.3366 94.63252-134.0508 7.16836-8.0511 28.51526-31.5969 28.65302-31.5969.051 0-1.11225 2.0153-2.57652 4.4694-12.65304 21.1938-23.47957 46.158-29.37751 67.7703-9.47448 34.6785-8.33163 64.4387 3.34693 87.5151 8.05611 15.898 21.86731 29.6684 37.3979 37.2806 27.18874 13.3214 66.9948 14.4235 115.60699 3.2245 3.34694-.7755 169.19363-44.801 368.55048-97.8366 199.35686-53.0408 362.49439-96.4029 362.51989-96.3672.056.046-463.16259 198.2599-703.62654 301.0914-38.08158 16.2806-48.26521 20.3928-66.16827 26.6785-45.76525 16.0714-86.76008 23.7398-119.89779 22.4235z" />
            </svg>
            <div className="text-xl font-medium text-white">CODE: CYBER</div>
          </div>
        </div>
      </Link>
    </div>
  );
}
