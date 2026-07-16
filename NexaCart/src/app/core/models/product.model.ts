export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  badge: 'Trending' | 'New' | 'Hot Deal' | 'Best Seller' | 'Featured';
  isNew?: boolean;
}
