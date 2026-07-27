import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';
import { AdminLayoutComponent } from '../../shared/admin-layout/admin-layout.component';
import { AdminTableComponent, AdminTableColumn } from '../../shared/admin-table/admin-table.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, AdminLayoutComponent, AdminTableComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  loading = false;

  tableColumns: AdminTableColumn[] = [
    { key: 'name',     label: 'Name' },
    { key: 'sku',      label: 'SKU' },
    { key: 'price',    label: 'Price', type: 'currency', currencySymbol: '₹' },
    { key: 'stockQuantity',    label: 'Stock', type: 'number' },
    { key: 'isActive', label: 'Status', type: 'status' }
  ];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void { this.loadProducts(); }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next:  (res) => { this.products = res; this.loading = false; },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  addProduct():           void { this.router.navigate(['/admin/products/add']); }
  editProduct(id: number):  void { this.router.navigate(['/admin/products/edit', id]); }

  deleteProduct(id: number): void {
    if (!confirm('Delete this product?')) return;
    this.productService.delete(id).subscribe({ next: () => this.loadProducts() });
  }
}