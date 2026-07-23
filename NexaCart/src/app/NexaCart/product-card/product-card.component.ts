import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  @Input() product?: Product | null;
  @Input() isWishlisted = false;
  @Input() animDelay = 0;

  @Output() addToCart = new EventEmitter<Product>();
  @Output() buyNow = new EventEmitter<Product>();
  @Output() wishlistToggled = new EventEmitter<number>();

  products: Product[] = [];
  categoryId!: number;
  categoryName = '';
  searchText = '';
  sortBy = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService
  ) { }

  ngOnInit(): void {
    const categoryIdParam = this.route.snapshot.paramMap.get('id');
    if (!this.product && categoryIdParam) {
      this.categoryId = Number(categoryIdParam);
      this.loadProducts();
    }
  }

  loadProducts(): void {
    this.productService.getByCategory(this.categoryId).subscribe({
      next: (data) => {
        this.products = data;
        this.categoryName = `Category ${this.categoryId}`;
      },
      error: (err) => console.error(err)
    });
  }

  get filteredProducts(): Product[] {
    const normalized = this.products;

    if (!this.searchText && !this.sortBy) {
      return normalized;
    }

    return normalized
      .filter(product =>
        `${product.name} ${product.description || ''}`.toLowerCase().includes(this.searchText.toLowerCase())
      )
      .sort((a, b) => {
        if (this.sortBy === 'low') {
          return a.price - b.price;
        }
        if (this.sortBy === 'high') {
          return b.price - a.price;
        }
        if (this.sortBy === 'rating') {
          return (b.rating ?? 0) - (a.rating ?? 0);
        }
        return 0;
      });
  }
}
