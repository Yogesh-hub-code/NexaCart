export interface Wishlist {
  wishlistId: number;
  productId: number;
  productName: string;
  price: number;
  discountPrice: number;
  thumbnailImage?: string;
}

export interface Cart {
  cartItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  thumbnailImage?: string;
}
