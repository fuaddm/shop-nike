import type { HTMLAttributes } from 'react';

export interface IProductMiniReviewSummary extends HTMLAttributes<HTMLDivElement> {
  stars: number;
  totalReviewCount: number;
}
