import { ProductSlider } from '@components/page/shared/ProductSlider';

import type { IProduct } from '@models/product';

export function SimilarProducts({ products, isLoading = true }: { products: IProduct[]; isLoading?: boolean }) {
  return (
    <>
      <div className="mb-6 text-3xl font-bold">Similar Products</div>
      <ProductSlider
        products={products}
        isLoading={isLoading}
      />
    </>
  );
}
