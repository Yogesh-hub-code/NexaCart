import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CategoryService } from '../../../../core/services/category.service';
import { Category } from '../../../../core/models/category.model';
import { AdminLayoutComponent } from '../../shared/admin-layout/admin-layout.component';
import { AdminTableComponent, AdminTableColumn } from '../../shared/admin-table/admin-table.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, AdminLayoutComponent, AdminTableComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];
  isLoading = false;

  tableColumns: AdminTableColumn[] = [
    { key: 'name',        label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'isActive',    label: 'Status', type: 'status' }
  ];

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAll().subscribe({
      next:  (res) => { this.categories = res; this.isLoading = false; },
      error: (err) => { console.error(err); this.isLoading = false; }
    });
  }

  editCategory(row: Category): void {
    this.router.navigate(['/admin/categories/edit', row.categoryId]);
  }

  deleteCategory(id: number): void {
    if (!confirm('Delete this category?')) return;
    this.categoryService.delete(id).subscribe({
      next:  () => this.loadCategories(),
      error: (err) => console.error(err)
    });
  }
}