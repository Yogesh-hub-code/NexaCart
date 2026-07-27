import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Brand, BrandService } from '../../../../core/services/brand.service';
import { AdminLayoutComponent } from '../../shared/admin-layout/admin-layout.component';
import { AdminTableComponent, AdminTableColumn } from '../../shared/admin-table/admin-table.component';

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, AdminLayoutComponent, AdminTableComponent],
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent implements OnInit {

  brands: Brand[] = [];
  isLoading = false;

  tableColumns: AdminTableColumn[] = [
    { key: 'brandName',   label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'isActive',    label: 'Status', type: 'status' }
  ];

  constructor(private router: Router, private brandService: BrandService) {}

  ngOnInit(): void { this.loadBrands(); }

  loadBrands(): void {
    this.isLoading = true;
    this.brandService.getAll().subscribe({
      next:  (res) => { this.brands = res; this.isLoading = false; },
      error: (err) => { console.error(err); this.isLoading = false; }
    });
  }

  addBrand():          void { this.router.navigate(['/admin/brands/add']); }
  editBrand(id: number): void { this.router.navigate(['/admin/brands/edit', id]); }

  deleteBrand(id: number): void {
    if (!confirm('Delete this brand?')) return;
    this.brandService.delete(id).subscribe({
      next:  () => this.loadBrands(),
      error: (err) => console.error(err)
    });
  }
}
