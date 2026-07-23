import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BrandService } from '../../../../core/services/brand.service';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './brand-form.component.html',
  styleUrls: ['./brand-form.component.css']
})
export class BrandFormComponent implements OnInit {
  id: number | null = null;
  isEditMode = false;
  name = '';
  description = '';
  isActive = true;
  isLoading = false;
  message = '';

  constructor(private router: Router, private route: ActivatedRoute, private brandService: BrandService) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {
      this.isEditMode = true;
      this.loadBrand();
    }
  }

  loadBrand(): void {
    if (!this.id) {
      return;
    }

    this.brandService.getById(this.id).subscribe({
      next: (brand) => {
        this.name = brand.brandName;
        this.description = brand.description ?? '';
        this.isActive = brand.isActive;
      },
      error: (error) => console.error(error)
    });
  }

  saveBrand(): void {
    if (!this.name.trim()) {
      this.message = 'Brand name is required';
      return;
    }

    this.isLoading = true;

    const request = {
      brandName: this.name,
      description: this.description,
      isActive: this.isActive
    };

    const request$ = this.isEditMode && this.id
      ? this.brandService.update(this.id, request)
      : this.brandService.create(request);

    request$.subscribe({
      next: () => {
        this.isLoading = false;
        this.message = this.isEditMode ? 'Brand updated successfully' : 'Brand created successfully';
        setTimeout(() => this.router.navigate(['/admin/brands']), 800);
      },
      error: (error) => {
        this.isLoading = false;
        this.message = 'Failed to save brand';
        console.error(error);
      }
    });
  }
}
