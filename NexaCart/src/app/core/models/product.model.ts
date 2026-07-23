export interface Product {
  productId: number;
  categoryId: number;
  brandId?: number;

  name: string;
  description?: string;
  sku: string;

  price: number;
  stock: number;

  imageUrl?: string;
  brand?: string;
  category?: string;
  rating?: number;
  discount?: number;
  isNew?: boolean;
  badge?: string;
  id?: number;

  isActive: boolean;
}