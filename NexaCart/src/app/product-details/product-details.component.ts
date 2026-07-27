import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../core/services/product.service';
import { Product } from '../core/models/product.model';


@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;
  loading = true;
  apiBaseUrl = 'https://localhost:7053';

  // UI state properties
  selectedImage: string = '';
  pincode: string = '';
  deliveryMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );
    this.loadProduct(id);
  }

  loadProduct(id: number) {
    this.productService.getById(id)
      .subscribe({
        next: (response:any) => {
          console.log(response);
          this.product = response;
          this.selectedImage = this.getImageUrl(response.imageUrl);
          this.loading = false;
        },
        error: (err: any) => {
          console.log(err);
          this.loading = false;
        }
      });
  }

  getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) {
      return 'https://via.placeholder.com/600x600?text=No+Image';
    }

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    const normalizedPath = imagePath.replace(/\\/g, '/');
    const baseUrl = this.apiBaseUrl.endsWith('/') ? this.apiBaseUrl.slice(0, -1) : this.apiBaseUrl;
    const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;

    return `${baseUrl}${cleanPath}`;
  }

  // UI Helper Methods
  checkDelivery(): void {
    if (this.pincode && this.pincode.trim().length === 6) {
      this.deliveryMessage = '⚡ Free Delivery by Tomorrow, 11 PM | Cash on Delivery Available';
    } else {
      this.deliveryMessage = '⚠️ Please enter a valid 6-digit Pincode';
    }
  }

  addToCart(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Please sign in to add items to your cart.');
      return;
    }
    alert(`"${this.product.name}" added to cart!`);
  }

  buyNow(): void {
    this.addToCart();
  }
}