import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button, CalendarGrid } from 'react-aria-components';
import { Link, useLoaderData } from 'react-router';
import type { loader } from '~/root';

import { useMenuStore } from '@stores/menuStore';

import { useLockBodyScroll } from '@hooks/useLockScroll';

import { cn } from '@libs/cn';

import type { IMenuProperties } from '@models/components/layout/menu';

export function Menu({ ref, mouseOut, selectedMainCategoryId, ...properties }: IMenuProperties) {
  const isOpen = useMenuStore((state) => state.isOpen);
  const setIsOpen = useMenuStore((state) => state.setIsOpen);

  useLockBodyScroll(isOpen);

  return (
    <div
      ref={ref}
      className={cn({
        'invisible absolute top-full left-0 z-20 h-screen w-full overflow-hidden': true,
        visible: isOpen,
      })}
      {...properties}
    >
      <div
        onMouseEnter={() => setIsOpen(false)}
        className={cn({
          'invisible absolute top-0 left-0 z-10 h-full w-full bg-black/60 opacity-0 transition dark:bg-white/20': true,
          'visible opacity-100': isOpen,
        })}
      ></div>
      <MenuMain
        selectedMainCategoryId={selectedMainCategoryId}
        mouseOut={mouseOut}
      />
    </div>
  );
}

function MenuMain({ mouseOut, selectedMainCategoryId }: Omit<IMenuProperties, 'ref'>) {
  const isOpen = useMenuStore((state) => state.isOpen);
  const setIsOpen = useMenuStore((state) => state.setIsOpen);
  const loaderData = useLoaderData<typeof loader>();
  const [mobileSelectedMainCategory, setMobileSelectedMainCategory] = useState<number | null>(null);
  const [mobileSelectedCategory, setMobileSelectedCategory] = useState<number | null>(null);

  function handleMainCategoryClick(id: number) {
    setMobileSelectedMainCategory(id);
  }

  function handleCategoryClick(id: number) {
    setMobileSelectedCategory(id);
  }

  function findCategoryName() {
    return loaderData.hierarchy.data.hierarchies
      .find((mainCategory) => mainCategory.id === mobileSelectedMainCategory)
      .categories?.find((category) => category.id === mobileSelectedCategory)?.name;
  }

  function findMainCategoryName() {
    return loaderData.hierarchy.data.hierarchies.find((mainCategory) => mainCategory.id === mobileSelectedMainCategory)
      ?.name;
  }

  return (
    <>
      <div
        onMouseOut={mouseOut}
        className={cn({
          'bg-surface relative z-20 flex w-full -translate-y-1/2 py-8 opacity-0 transition xl:hidden': true,
          'translate-y-0 opacity-100': isOpen,
        })}
      >
        <div className="container flex flex-col gap-1.5">
          {mobileSelectedMainCategory === null &&
            loaderData.hierarchy &&
            loaderData.hierarchy.data.hierarchies.map((mainCategory) => {
              return (
                <Button
                  key={mainCategory.id}
                  onPress={() => handleMainCategoryClick(mainCategory.id)}
                  className="bg-surface-container-low flex items-center justify-between rounded-lg px-3 py-2"
                >
                  {mainCategory.name}
                  <div>
                    <ChevronRight />
                  </div>
                </Button>
              );
            })}

          {mobileSelectedMainCategory !== null && mobileSelectedCategory === null && (
            <Button
              onPress={() => {
                setMobileSelectedMainCategory(null);
              }}
              className="mb-3 flex w-fit items-center gap-1"
            >
              <ChevronLeft />
              <div>Back to {findMainCategoryName()}</div>
            </Button>
          )}
          {mobileSelectedMainCategory !== null &&
            mobileSelectedCategory === null &&
            loaderData.hierarchy &&
            loaderData.hierarchy.data.hierarchies
              .find((mainCategory) => mainCategory.id === mobileSelectedMainCategory)
              .categories?.map((category) => {
                return (
                  <Button
                    key={category.id}
                    onPress={() => handleCategoryClick(category.id)}
                    className="bg-surface-container-low flex items-center justify-between rounded-lg px-3 py-2"
                  >
                    {category.name}
                    <div>
                      <ChevronRight />
                    </div>
                  </Button>
                );
              })}

          {mobileSelectedMainCategory !== null && mobileSelectedCategory !== null && (
            <Button
              onPress={() => {
                setMobileSelectedCategory(null);
              }}
              className="mb-3 flex w-fit items-center gap-1"
            >
              <ChevronLeft />
              <div>Back to {findCategoryName()}</div>
            </Button>
          )}
          {mobileSelectedMainCategory !== null &&
            mobileSelectedCategory !== null &&
            loaderData.hierarchy &&
            loaderData.hierarchy.data.hierarchies
              .find((mainCategory) => mainCategory.id === mobileSelectedMainCategory)
              .categories?.find((category) => category.id === mobileSelectedCategory)
              .sub_categories.map((subCategory) => {
                return (
                  <Link
                    key={subCategory.id}
                    to={`/products?MainCategoryId=${mobileSelectedMainCategory}&CategoryId=${mobileSelectedCategory}&SubCategoryId=${subCategory.id}`}
                    onClick={() => setIsOpen(false)}
                    className="bg-surface-container-low flex items-center justify-between rounded-lg px-3 py-2"
                  >
                    {subCategory.name}
                  </Link>
                );
              })}
        </div>
      </div>
      <div
        onMouseOut={mouseOut}
        className={cn({
          'bg-surface relative z-20 hidden w-full -translate-y-1/2 py-12 opacity-0 transition xl:flex': true,
          'translate-y-0 opacity-100': isOpen,
        })}
      >
        <div className="container flex flex-col flex-wrap justify-center gap-4 md:flex-row md:gap-20">
          {loaderData.hierarchy &&
            loaderData.hierarchy.data.hierarchies.find((mainCategory) => mainCategory.id === selectedMainCategoryId) &&
            loaderData.hierarchy.data.hierarchies
              .find((mainCategory) => mainCategory.id === selectedMainCategoryId)
              .categories?.map((category) => {
                return (
                  <div
                    key={category.id}
                    className="flex flex-col gap-1"
                  >
                    <Link
                      to={`/products?MainCategoryId=${selectedMainCategoryId}&CategoryId=${category.id}`}
                      onClick={() => setIsOpen(false)}
                      className="mb-1 font-bold"
                    >
                      {category.name}
                    </Link>
                    {category.sub_categories.map((subCategory) => {
                      return (
                        <Link
                          key={subCategory.id}
                          onClick={() => setIsOpen(false)}
                          to={`/products?MainCategoryId=${selectedMainCategoryId}&CategoryId=${category.id}&SubCategoryId=${subCategory.id}`}
                          className="text-on-surface-variant hover:text-on-surface text-sm"
                        >
                          {subCategory.name}
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
        </div>
      </div>
    </>
  );
}
