import { createSerializer, parseAsNativeArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useCallback, useEffect, useState } from 'react';
import { useFetcher, useNavigation, useRouteLoaderData } from 'react-router';
import { PAGE_SIZE } from '~/routes/products-data';

import { SearchInput } from '@ui/input/SearchInput';

import { Filter } from '@components/page/products/Filter';
import { HideAndShowFilter } from '@components/page/products/HideAndShowFilter';
import { PaginationProducts } from '@components/page/products/PaginationProducts';
import { Sort } from '@components/page/products/Sort';
import { ProductCard } from '@components/page/shared/ProductCard';
import { SkeletonProductCard } from '@components/page/shared/SkeletonProductCard';

import { cn } from '@libs/cn';

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

const searchParameters = {
  SortId: parseAsString,
  MainCategoryId: parseAsString,
  CategoryId: parseAsString,
  SubCategoryId: parseAsString,
  PriceRangeId: parseAsString,
  ClothingGenderId: parseAsNativeArrayOf(parseAsString),
  ColorId: parseAsNativeArrayOf(parseAsString),
  search: parseAsString,
  PageNumber: parseAsString,
};
const serialize = createSerializer(searchParameters);

export function getTitle(hierarchies, mainCategoryId?: number, categoryId?: number, subCategoryId?: number) {
  if (mainCategoryId) {
    const mainCategory = hierarchies.find((item) => item.id === mainCategoryId);
    if (categoryId) {
      if (subCategoryId) {
        const category = mainCategory.categories.find((item) => item.id === categoryId);
        const subCategory = category.sub_categories.find((item) => item.id === subCategoryId);
        return mainCategory.name + "'s " + subCategory.name + ' ' + category.name;
      } else {
        const category = mainCategory.categories.find((item) => item.id === categoryId);
        return mainCategory.name + "'s " + category.name;
      }
    } else {
      return mainCategory.name + "'s Products";
    }
  }
}

export default function ProductsPage() {
  const rootLoaderData = useRouteLoaderData('root');
  const navigation = useNavigation();

  const [search, setSearch] = useQueryState('search', parseAsString.withDefault('').withOptions({ shallow: true }));

  const fetcher = useFetcher();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  const [sortId, setSortId] = useQueryState('SortId', {
    defaultValue: '1',
  });
  const [mainCategoryId, setMainCategoryId] = useQueryState('MainCategoryId');
  const [categoryId, setCategoryId] = useQueryState('CategoryId');
  const [subCategoryId, setSubCategoryId] = useQueryState('SubCategoryId');
  const [priceRangeId, setPriceRangeId] = useQueryState('PriceRangeId');
  const [clothingGenderId, setClothingGenderId] = useQueryState(
    'ClothingGenderId',
    parseAsNativeArrayOf(parseAsString)
  );
  const [colorId, setColorId] = useQueryState('ColorId', parseAsNativeArrayOf(parseAsString));
  const [pageNumber, setPageNumber] = useQueryState('PageNumber', {
    defaultValue: '1',
    scroll: true,
  });

  const titleOfPage = getTitle(
    rootLoaderData.hierarchy.data.hierarchies,
    Number(mainCategoryId),
    Number(categoryId),
    Number(subCategoryId)
  );

  const searchParametersSerialized = serialize({
    SortId: sortId,
    MainCategoryId: mainCategoryId,
    CategoryId: categoryId,
    SubCategoryId: subCategoryId,
    PriceRangeId: priceRangeId,
    ClothingGenderId: clothingGenderId,
    ColorId: colorId,
    search,
    PageNumber: pageNumber,
  });

  const resetFilters = () => {
    setMainCategoryId(null);
    setSortId(null);
    setCategoryId(null);
    setSubCategoryId(null);
    setPriceRangeId(null);
    setClothingGenderId(null);
    setColorId(null);
  };

  const handleSearchChange = (newTerm: string) => {
    setSearch(newTerm);
    setPageNumber('1');
    resetFilters();
  };

  useEffect(() => {
    if (navigation.location?.pathname === '/products' || navigation.location === undefined) {
      fetcher.load(`/products-data${searchParametersSerialized}`);
    }
  }, [searchParametersSerialized]);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      setProducts(fetcher.data.items);
      setTotal(fetcher.data.totalCount);
    }
  }, [fetcher]);

  const debouncedSearch = useCallback(debounce(handleSearchChange, 500), []);

  return (
    <div className="container py-10">
      <h2 className="mb-6 text-center text-2xl font-semibold">{titleOfPage}</h2>
      <div className="mb-4 flex items-center justify-end gap-3">
        <SearchInput
          defaultValue={search}
          name="search"
          onChange={(e) => debouncedSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setSearch(e.target.value);
            }
          }}
        />
        <HideAndShowFilter />
        <Sort />
      </div>
      <div className="mb-10 flex">
        <Filter />
        <div
          className={cn({
            'grid h-fit w-full grid-cols-2 gap-3 gap-y-4 md:gap-y-10 lg:grid-cols-3': true,
            'grid w-full grid-cols-1 place-items-center lg:grid-cols-1':
              products.length === 0 && fetcher.state !== 'loading',
          })}
        >
          {(fetcher.state === 'loading' || (fetcher.state === 'idle' && fetcher.data === undefined)) && (
            <>
              {Array.from({ length: PAGE_SIZE })
                .fill(0)
                .map((_, index) => {
                  return <SkeletonProductCard key={index} />;
                })}
            </>
          )}
          {fetcher.state !== 'loading' && (
            <>
              {products.map((product) => {
                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    category={product.category}
                    mainCategory={product.mainCategory}
                    name={product.name}
                    image={product.image}
                    pricing={product.pricing}
                    variations={product.variations}
                  />
                );
              })}
            </>
          )}
          {fetcher.state !== 'loading' && products.length === 0 && (
            <div className="mt-20 grid w-full place-items-center">
              <img
                src="/svg/Pack.svg"
                className="aspect-square w-60"
              />
            </div>
          )}
        </div>
      </div>
      {!(fetcher.state !== 'loading' && products.length === 0) && <PaginationProducts total={total} />}
    </div>
  );
}
