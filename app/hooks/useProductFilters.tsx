import { createSerializer, parseAsNativeArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useCallback } from 'react';

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
  q: parseAsString,
  PageNumber: parseAsString,
};
const serialize = createSerializer(searchParameters);

export function useProductFilters() {
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault('').withOptions({ shallow: true }));
  const [globalSearch, setGlobalSearch] = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({ shallow: true })
  );

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

  const searchParametersSerialized = serialize({
    SortId: sortId,
    MainCategoryId: mainCategoryId,
    CategoryId: categoryId,
    SubCategoryId: subCategoryId,
    PriceRangeId: priceRangeId,
    ClothingGenderId: clothingGenderId,
    ColorId: colorId,
    search,
    q: globalSearch,
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
    setGlobalSearch('');
  };

  const handleGlobalSearchChange = (newTerm: string) => {
    setGlobalSearch(newTerm);
    setPageNumber('1');
    setSearch('');
    resetFilters();
  };

  const debouncedSearch = useCallback(debounce(handleSearchChange, 500), []);

  return {
    handleGlobalSearchChange,
    handleSearchChange,
    searchParametersSerialized,
    debouncedSearch,
    globalSearch,
  };
}
