import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CategoryService } from '../../../../core/services/category.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent {


  name = '';
  description = '';

  isLoading = false;

  message = '';
  id: number | null = null;
  isEditMode = false;


  constructor(
    private categoryService: CategoryService,
    private router: Router, private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    debugger;

    this.id = Number(
      this.route.snapshot.paramMap.get('id')
    );


    if (this.id) {

      this.isEditMode = true;

      this.loadCategory();

    }

  }

  loadCategory() {
    debugger;

    this.categoryService.getById(this.id!)
      .subscribe({

        next: (data) => {

          this.name = data.name;
          this.description = data.description ?? '';

        },

        error: (err) => {
          console.error(err);
        }

      });

  }

  saveCategory(): void {

    if (!this.name.trim()) {

      this.message = 'Category name is required';

      return;
    }


    const request = {

      name: this.name,

      description: this.description,

      isActive: true

    };


    this.isLoading = true;


    const apiCall = this.isEditMode
      ? this.categoryService.update(this.id!, request)
      : this.categoryService.create(request);



    apiCall.subscribe({

      next: (response) => {

        this.isLoading = false;


        this.message = this.isEditMode
          ? 'Category updated successfully'
          : 'Category created successfully';



        setTimeout(() => {

          this.router.navigate([
            '/admin/categories'
          ]);

        }, 1000);

      },


      error: (error) => {

        console.error(error);

        this.isLoading = false;

        this.message = this.isEditMode
          ? 'Failed to update category'
          : 'Failed to create category';

      }

    });

  }


}