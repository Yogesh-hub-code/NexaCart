import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { ProductService } from '../../../../core/services/product.service';
import { CategoryService } from '../../../../core/services/category.service';
import { Category } from '../../../../core/models/category.model';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, NgSelectModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {

  id: number | null = null;
  isEditMode = false;

  categories: Category[] = [];

  categoryId = 0;
  name = '';
  description = '';
  price = 0;
  stock = 0;
  discountPrice = 0;
  brandId = 1;          // temporary
  sku = '';
  imageUrl = '';
  isActive = true;

  isLoading = false;
  message = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.loadCategories();

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {

      this.isEditMode = true;

      this.loadProduct();

    }

  }

  loadCategories(): void {

    this.categoryService.getAll().subscribe({

      next: (data) => {
        console.log('Categories response:', data);

        // API may return an array or a wrapper object { data: [...] }
        if (Array.isArray(data)) {
          this.categories = data;
        } else if (data && Array.isArray((data as any).data)) {
          this.categories = (data as any).data;
        } else {
          this.categories = [];
        }

      },

      error: (err) => console.error(err)

    });

  }

  loadProduct(): void {

    this.productService.getById(this.id!).subscribe({

      next: (data) => {

        this.categoryId = data.categoryId;
        this.name = data.name;
        this.description = data.description ?? '';
        this.price = data.price;
        this.stock = data.stock;
        this.imageUrl = data.imageUrl ?? '';
        this.isActive = data.isActive;

      },

      error: (err) => console.error(err)

    });

  }

  saveProduct(): void {
    if (!this.name.trim()) {

      this.message = 'Product name is required';

      return;

    }

    if (!this.sku.trim()) {

      this.message = 'SKU is required';

      return;

    }

    if (this.categoryId === 0) {

      this.message = 'Please select a category';

      return;

    }

    const request = {
      categoryId: this.categoryId,
      brandId: this.brandId,
      name: this.name,
      description: this.description,
      price: this.price,
      discountPrice: this.discountPrice,
      stock: this.stock,
      sku: this.sku,
      imageUrl: this.imageUrl,
      isActive: this.isActive
    };

    console.log('Saving product request', request);

    this.isLoading = true;

    const apiCall = this.isEditMode
      ? this.productService.update(this.id!, request)
      : this.productService.create(request);

    apiCall.subscribe({

      next: () => {

        this.isLoading = false;

        this.message = this.isEditMode
          ? 'Product updated successfully'
          : 'Product created successfully';

        setTimeout(() => {

          this.router.navigate(['/admin/products']);

        }, 1000);

      },

      error: (err) => {

        console.error(err);

        this.isLoading = false;

        if (err?.status === 409 || err?.error?.message?.toLowerCase().includes('sku')) {
          this.message = 'A product with this SKU already exists. Please use a unique SKU.';
        } else {
          this.message = this.isEditMode
            ? 'Failed to update product'
            : 'Failed to create product';
        }

      }

    });

  }

}