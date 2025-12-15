import { ProductSlider } from '@components/page/shared/ProductSlider';

interface IProductsSectionProperties {
  products: unknown;
}

export function ProductsSection({ products }: IProductsSectionProperties) {
  return (
    <div className="container py-10">
      <div className="mb-14">
        <div className="mb-5 text-2xl font-bold">Latest Products</div>
        <ProductSlider
          products={products.data.items}
          swipeButtons="top"
        />
      </div>
    </div>
  );
}
