import { useQueryState } from 'nuqs';
import { PAGE_SIZE } from '~/routes/products-data';

import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@ui/Pagination';

function generatePaginationArray(totalItems: number, activePage: number, neighborCount = 2) {
  // 1. Calculate the total number of pages
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  if (totalPages <= 1) {
    return totalPages === 1 ? [1] : [];
  }

  // Ensure activePage is within valid bounds
  const currentActivePage = Math.max(1, Math.min(activePage, totalPages));

  // Use a Set to store unique page numbers (ensures no duplicates)
  const pagesToShow = new Set<number>();

  // 2. Always include the first and last page
  pagesToShow.add(1);
  pagesToShow.add(totalPages);

  // 3. Include the active page and its neighbors
  for (let index = currentActivePage - neighborCount; index <= currentActivePage + neighborCount; index++) {
    // Only add page numbers that are valid (between 1 and totalPages)
    if (index >= 1 && index <= totalPages) {
      pagesToShow.add(index);
    }
  }

  // 4. Convert the Set to an Array and sort the numbers
  const resultNumbers = [...pagesToShow].sort((a, b) => a - b);

  return resultNumbers;
}

export function PaginationProducts({ total }: { total: number }) {
  const [pageNumber, setPageNumber] = useQueryState('PageNumber', {
    defaultValue: '1',
    scroll: true,
  });

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            isDisabled={Number(pageNumber) <= 1}
            onClick={() => {
              if (Number(pageNumber) > 1) {
                setPageNumber(String(Number(pageNumber) - 1));
              }
            }}
          />
        </PaginationItem>
        {generatePaginationArray(total, Number(pageNumber)).map((item) => {
          return (
            <PaginationItem key={'pag:' + item}>
              <PaginationButton
                onPress={() => setPageNumber(String(item))}
                isActive={pageNumber === String(item)}
              >
                {String(item)}
              </PaginationButton>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            isDisabled={Number(pageNumber) >= Math.ceil(total / PAGE_SIZE)}
            onClick={() => {
              if (Number(pageNumber) < Math.ceil(total / PAGE_SIZE)) {
                setPageNumber(String(Number(pageNumber) + 1));
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
