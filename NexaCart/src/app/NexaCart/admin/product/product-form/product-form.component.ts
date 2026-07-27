import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { ProductService } from '../../../../core/services/product.service';
import { CategoryService } from '../../../../core/services/category.service';
import { BrandService, Brand } from '../../../../core/services/brand.service';
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
  brands: Brand[] = [];

  categoryId = 0;
  brandId = 0;
  name = '';
  description = '';
  price = 0;
  stock = 0;
  discountPrice = 0;
  sku = '';
  imageUrl = '';
  isActive = true;

  isLoading = false;
  message = '';
  stockQuantity: number = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadBrands();

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {
      this.isEditMode = true;
      this.loadProduct();
    }
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
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

  selectedImage!: File;

  onImageSelected(event: Event): void {
    debugger;

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {

      this.selectedImage = input.files[0];

      console.log(this.selectedImage);

    }

  }

  loadBrands(): void {
    this.brandService.getAll().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.brands = data;
        } else if (data && Array.isArray((data as any).data)) {
          this.brands = (data as any).data;
        } else {
          this.brands = [];
        }
      },
      error: (err) => console.error(err)
    });
  }

  loadProduct(): void {
    this.productService.getById(this.id!).subscribe({
      next: (data) => {
        this.categoryId = data.categoryId;
        this.brandId = data.brandId ?? 0;
        this.name = data.name;
        this.description = data.description ?? '';
        this.price = data.price;
        this.stock = data.stock;
        this.sku = (data as any).sku ?? '';
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

    if (this.brandId === 0) {
      this.message = 'Please select a brand';
      return;
    }

    console.log('categoryId', this.categoryId);
    console.log('brandId', this.brandId);
    console.log('price', this.price);
    console.log('discountPrice', this.discountPrice);
    console.log('stockQuantity', this.stockQuantity);
    console.log('isActive', this.isActive);

    const formData = new FormData();

    formData.append('categoryId', this.categoryId.toString());
    formData.append('brandId', this.brandId.toString());
    formData.append('name', this.name);
    formData.append('productDescription', this.description);
    formData.append('price', this.price.toString());
    formData.append('discountPrice', this.discountPrice.toString());
    formData.append('stockQuantity', this.stockQuantity.toString());
    formData.append('sku', this.sku);
    formData.append('isActive', this.isActive.toString());

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.isLoading = true;

    const apiCall = this.isEditMode
      ? this.productService.update(this.id!, formData)
      : this.productService.create(formData);

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