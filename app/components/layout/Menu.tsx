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
        'invisible absolute top-full left-0 z-20 h-[calc(100vh-100%)] w-full overflow-hidden': true,
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

  return (
    <div
      onMouseOut={mouseOut}
      className={cn({
        'bg-surface relative z-20 flex w-full -translate-y-1/2 py-12 opacity-0 transition': true,
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
  );
}
