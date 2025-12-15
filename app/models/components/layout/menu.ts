import type { HTMLAttributes, MouseEvent, Ref } from 'react';

export interface IMenuProperties extends HTMLAttributes<HTMLDivElement> {
  ref: Ref<HTMLDivElement>;
  mouseOut: (element: MouseEvent<HTMLDivElement>) => void;
  selectedMainCategoryId: number | null;
}
