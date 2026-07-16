import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly products: Product[] = [
    {
      id: 1,
      name: 'Nova Smartwatch Pro',
      brand: 'Apple',
      category: 'Electronics',
      price: 249,
      originalPrice: 349,
      discount: 29,
      rating: 4.8,
      reviews: 1820,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
      badge: 'Trending'
    },
    {
      id: 2,
      name: 'Aero Runner Sneakers',
      brand: 'Nike',
      category: 'Fashion',
      price: 129,
      originalPrice: 169,
      discount: 24,
      rating: 4.7,
      reviews: 980,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      badge: 'Best Seller'
    },
    {
      id: 3,
      name: 'Luma Laptop 14',
      brand: 'Dell',
      category: 'Electronics',
      price: 899,
      originalPrice: 1199,
      discount: 25,
      rating: 4.6,
      reviews: 740,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
      badge: 'Hot Deal',
      isNew: true
    },
    {
      id: 4,
      name: 'Velora Leather Tote',
      brand: 'H&M',
      category: 'Fashion',
      price: 84,
      originalPrice: 120,
      discount: 30,
      rating: 4.5,
      reviews: 610,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      badge: 'Featured',
      isNew: true
    },
    {
      id: 5,
      name: 'Glow Studio Lamp',
      brand: 'IKEA',
      category: 'Home',
      price: 67,
      originalPrice: 89,
      discount: 25,
      rating: 4.4,
      reviews: 450,
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      badge: 'Trending'
    },
    {
      id: 6,
      name: 'Cloud Max Headphones',
      brand: 'Sony',
      category: 'Electronics',
      price: 159,
      originalPrice: 199,
      discount: 20,
      rating: 4.9,
      reviews: 1320,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      badge: 'Best Seller'
    },
    {
      id: 7,
      name: 'Marble Carryall',
      brand: 'Zara',
      category: 'Fashion',
      price: 92,
      originalPrice: 129,
      discount: 29,
      rating: 4.3,
      reviews: 330,
      image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=80',
      badge: 'New',
      isNew: true
    },
    {
      id: 8,
      name: 'Harbor Sofa Accent',
      brand: 'IKEA',
      category: 'Home',
      price: 210,
      originalPrice: 280,
      discount: 25,
      rating: 4.6,
      reviews: 590,
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      badge: 'Featured'
    },
    {
      id: 9,
      name: 'Orbit Camera Mini',
      brand: 'Canon',
      category: 'Electronics',
      price: 399,
      originalPrice: 529,
      discount: 24,
      rating: 4.7,
      reviews: 810,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      badge: 'Trending'
    },
    {
      id: 10,
      name: 'Sculpt Denim Jacket',
      brand: 'Adidas',
      category: 'Fashion',
      price: 109,
      originalPrice: 149,
      discount: 27,
      rating: 4.8,
      reviews: 700,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      badge: 'Hot Deal'
    }
  ];

  getProducts(): Product[] {
    return this.products;
  }

  getPopularBrands(): string[] {
    return ['Apple', 'Nike', 'Samsung', 'Adidas', 'H&M', 'Canon'];
  }

  getCategories(): Array<{ name: string; icon: string }> {
    return [
      { name: 'Electronics', icon: '📱' },
      { name: 'Fashion', icon: '👗' },
      { name: 'Home', icon: '🏡' }
    ];
  }

  getFeaturedSections(): Array<{ title: string; subtitle: string; category: string }> {
    return [
      { title: 'Electronics Essentials', subtitle: 'Smart gear for modern living', category: 'Electronics' },
      { title: 'Style Picks', subtitle: 'Trending fashion for every day', category: 'Fashion' },
      { title: 'Refresh Your Space', subtitle: 'Comfort, texture, and personality', category: 'Home' }
    ];
  }
}
