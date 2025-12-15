interface IProductVariation {
  /** A unique code for the specific product variation. */
  code: string;
  /** URL to the image for this variation. */
  image: string;
}

interface IProductCategory {
  /** The unique identifier for the category. */
  id: number;
  /** The name of the category (e.g., "Clothing"). */
  name: string;
}

interface IProductPricing {
  /** The standard price of the product. */
  price: number;
  /** Details about any current promotion. */
  promo: {
    /** The promotional code, or null if no code is active. */
    code: string | null;
    /** The discount percentage (0 if no discount). */
    discount: number;
  };
}

export interface IProduct {
  /** A unique identifier for the product. */
  id: string;
  /** The name of the product. */
  name: string;
  /** URL to the main image of the product. */
  image: string;
  /** The top-level category or main grouping (e.g., "Men"). */
  mainCategory: IProductCategory;
  /** The specific category within the main category (e.g., "Clothing"). */
  category: IProductCategory;
  /** The gender classification of the product. */
  gender: {
    /** The unique identifier for the gender. */
    id: number;
    /** The name of the gender (e.g., "Men"). */
    name: string;
  };
  /** The number of different colors available for the product. */
  colors: number;
  /** Pricing information including the price and any promotions. */
  pricing: IProductPricing;
  /** An array of different variations (e.g., sizes, colors, styles) available. */
  variations: IProductVariation[];
}
