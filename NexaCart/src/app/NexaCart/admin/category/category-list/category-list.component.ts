import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../../core/services/category.service';
import { Category } from '../../../../core/models/category.model';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, RouterLinkActive
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];

  isLoading = false;


  constructor(
    private categoryService: CategoryService
  ) {}


  ngOnInit(): void {
    this.loadCategories();
  }


  loadCategories(): void {

    this.isLoading = true;

    this.categoryService.getAll()
      .subscribe({

        next: (response) => {

          this.categories = response;

          this.isLoading = false;
        },


        error: (error) => {

          console.error(error);

          this.isLoading = false;
        }

      });
  }


  deleteCategory(id: number): void {

    if (!confirm('Delete this category?'))
      return;


    this.categoryService.delete(id)
      .subscribe({

        next: () => {

          this.loadCategories();

        },


        error: (error) => {

          console.error(error);

        }

      });

  }

}