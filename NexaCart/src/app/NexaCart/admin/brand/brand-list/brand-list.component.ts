import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Brand, BrandService } from '../../../../core/services/brand.service';

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent implements OnInit {
  brands: Brand[] = [];
  isLoading = false;

  constructor(private router: Router, private brandService: BrandService) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.isLoading = true;

    this.brandService.getAll().subscribe({
      next: (response) => {
        this.brands = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  addBrand(): void {
    this.router.navigate(['/admin/brands/add']);
  }

  editBrand(id: number): void {
    this.router.navigate(['/admin/brands/edit', id]);
  }

  deleteBrand(id: number): void {
    if (!confirm('Delete this brand?')) {
      return;
    }

    this.brandService.delete(id).subscribe({
      next: () => {
        this.loadBrands();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
