import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  loading = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;

    this.productService.getAll().subscribe({

      next: (response) => {
        this.products = response;
        this.loading = false;
      },

      error: (err) => {
        console.error(err);
        this.loading = false;
      }

    });

  }

  addProduct() {
    this.router.navigate(['/admin/products/add']);
  }

  editProduct(id: number) {
    this.router.navigate(['/admin/products/edit', id]);
  }

  deleteProduct(id: number) {
    if (!confirm('Delete this product?')) return;

    this.productService.delete(id).subscribe({
      next: () => {
        this.loadProducts();
      }
    });
  }

}