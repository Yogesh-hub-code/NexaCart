import { Routes } from '@angular/router';
import { HomeComponent } from './NexaCart/home/home.component';
import { LoginComponent } from './NexaCart/login/login.component';
import { CategoryListComponent } from './NexaCart/admin/category/category-list/category-list.component';
import { CategoryFormComponent } from './NexaCart/admin/category/category-form/category-form.component';
import { DashboardComponent } from './NexaCart/admin/dashboard/dashboard.component';
import { ProfileComponent } from './NexaCart/profile/profile.component';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { ProductCardComponent } from './NexaCart/product-card/product-card.component';
import { ProductListComponent } from './NexaCart/admin/product/product-list/product-list.component';
import { ProductFormComponent } from './NexaCart/admin/product/product-form/product-form.component';
import { BrandListComponent } from './NexaCart/admin/brand/brand-list/brand-list.component';
import { BrandFormComponent } from './NexaCart/admin/brand/brand-form/brand-form.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'admin', component: DashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/categories', component: CategoryListComponent, canActivate: [adminGuard] },
  { path: 'admin/categories/add', component: CategoryFormComponent, canActivate: [adminGuard] },
  { path: 'admin/categories/edit/:id', component: CategoryFormComponent, canActivate: [adminGuard] },
  {
  path: 'admin/products',
  component: ProductListComponent,
  canActivate: [adminGuard]
},
{
  path: 'admin/products/add',
  component: ProductFormComponent,
  canActivate: [adminGuard]
},
{
  path: 'admin/products/edit/:id',
  component: ProductFormComponent,
  canActivate: [adminGuard]
},
{
  path: 'admin/brands',
  component: BrandListComponent,
  canActivate: [adminGuard]
},
{
  path: 'admin/brands/add',
  component: BrandFormComponent,
  canActivate: [adminGuard]
},
{
  path: 'admin/brands/edit/:id',
  component: BrandFormComponent,
  canActivate: [adminGuard]
},
  { path: 'products/category/:id', component: ProductCardComponent},
  { path: '**', redirectTo: '' }
];
