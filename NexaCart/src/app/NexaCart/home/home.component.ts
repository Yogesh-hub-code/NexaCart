import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProductCardComponent } from '../product-card/product-card.component';
import { LoginRequest } from '../../core/models/login-request.model';
import { Product } from '../../core/models/product.model';

import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  searchTerm = '';
  selectedBrand = 'All';
  selectedCategory = 'All';
  selectedRating = 0;
  maxPrice = 1500;
  searchFocused = false;

  // Authentication states
  isAuthenticated = false;
  isLoading = false;
  showAuthModal = false;
  authMessage = '';
  username = '';

  // Login credentials
  email = '';
  password = '';

  // Registration/Sign Up properties
  isSignUpMode = false;
  firstName = '';
  lastName = '';
  registerEmail = '';
  registerPassword = '';

  // Commerce track settings
  cartCount = 0;
  wishlistIds: number[] = [];
  pendingProduct: Product | null = null;
  pendingAction: 'cart' | 'buy' | null = null;

  constructor(
    private readonly productService: ProductService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.products = this.productService.getProducts();

    const user = localStorage.getItem('user');
    if (user) {
      const currentUser = JSON.parse(user);
      this.isAuthenticated = true;
      this.username = currentUser.username;
    }
  }

  // ==========================================================================
  // FILTERS & COMPUTED PROPERTY GETTERS
  // ==========================================================================
  get filteredProducts(): Product[] {
    return this.products.filter(product => this.matchesFilters(product));
  }

  get popularBrands(): string[] {
    return this.productService.getPopularBrands();
  }

  get categories() {
    return this.productService.getCategories();
  }

  get featuredSections() {
    return this.productService.getFeaturedSections();
  }

  get trendingProducts(): Product[] {
    return this.filteredProducts
      .filter(x => x.badge === 'Trending')
      .slice(0, 4);
  }

  get dealsProducts(): Product[] {
    return this.filteredProducts
      .filter(x => x.discount >= 20)
      .slice(0, 4);
  }

  get newArrivalsProducts(): Product[] {
    return this.filteredProducts
      .filter(x => x.isNew)
      .slice(0, 4);
  }

  get brands(): string[] {
    return [
      'All',
      ...new Set(this.products.map(x => x.brand))
    ];
  }

  getProductsByCategory(category: string): Product[] {
    return this.filteredProducts
      .filter(x => x.category === category)
      .slice(0, 4);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedBrand = 'All';
    this.selectedCategory = 'All';
    this.selectedRating = 0;
    this.maxPrice = 1500;
  }

  focusCategoryPanel(): void {
    this.selectedCategory = 'All';
    this.selectedBrand = 'All';
    this.authMessage = 'Showing all categories.';
  }

  showDeals(): void {
    this.selectedRating = 4;
    this.maxPrice = 500;
    this.authMessage = 'Showing top deals under $500.';
  }

  showBrands(): void {
    this.selectedBrand = 'Apple';
    this.authMessage = 'Showing Apple favorites.';
  }

  openCart(): void {
    if (this.cartCount === 0) {
      this.authMessage = 'Your cart is currently empty.';
      return;
    }

    this.authMessage = `You have ${this.cartCount} product(s) in your cart.`;
  }

  // ==========================================================================
  // MODAL GATEWAYS & AUTHENTICATION STREAMS
  // ==========================================================================
  openLoginModal(): void {
    this.isSignUpMode = false;
    this.pendingAction = null;
    this.pendingProduct = null;
    this.authMessage = '';
    this.showAuthModal = true;
  }

  openAuthModal(action: 'cart' | 'buy', product: Product): void {
    this.isSignUpMode = false;
    this.pendingAction = action;
    this.pendingProduct = product;
    this.authMessage = '';
    this.showAuthModal = true;
  }

  switchToSignUp(): void {
    this.isSignUpMode = true;
    this.authMessage = '';
  }

  switchToLogin(): void {
    this.isSignUpMode = false;
    this.authMessage = '';
  }

  closeAuthModal(): void {
    this.showAuthModal = false;
    this.isSignUpMode = false;
    this.authMessage = '';
    this.email = '';
    this.password = '';
    this.firstName = '';
    this.lastName = '';
    this.registerEmail = '';
    this.registerPassword = '';
    this.pendingAction = null;
    this.pendingProduct = null;
  }

  handleAuth(): void {
    debugger;
    this.authMessage = '';

    if (!this.email.trim()) {
      this.authMessage = 'Please enter your email.';
      return;
    }

    if (!this.password.trim()) {
      this.authMessage = 'Please enter your password.';
      return;
    }

    this.isLoading = true;

    const request: LoginRequest = {
      email: this.email.trim(),
      password: this.password
    };

    this.authService.login(request).subscribe({
      next: (result) => {
        this.isLoading = false;
        debugger;

        if (!result.success) {
          this.authMessage = result.message;
          return;
        }

        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.isAuthenticated = true;
        this.username = result.user.firstName;
        this.authMessage = result.message;

        this.email = '';
        this.password = '';
        this.closeAuthModal();

        if (this.pendingAction && this.pendingProduct) {
          if (this.pendingAction === 'cart') {
            this.addToCart(this.pendingProduct);
          }
          if (this.pendingAction === 'buy') {
            this.buyNow(this.pendingProduct);
          }
        }

        this.pendingAction = null;
        this.pendingProduct = null;
      },
      error: () => {
        this.isLoading = false;
        this.authMessage = 'Login failed. Account credentials not recognized.';
      }
    });
  }

  handleRegister(): void {
    debugger;

    this.authMessage = '';

    if (!this.firstName.trim()) {
      this.authMessage = 'Please enter First name.';
      return;
    }

    if (!this.lastName.trim()) {
      this.authMessage = 'Please enter Last name.';
      return;
    }

    if (!this.registerEmail.trim()) {
      this.authMessage = 'Please enter your email address.';
      return;
    }

    if (!this.registerPassword.trim()) {
      this.authMessage = 'Please enter a secure password.';
      return;
    }


    this.isLoading = true;


    const registerData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.registerEmail,
      password: this.registerPassword,
      roleId: 2   // Customer role
    };


    this.authService.register(registerData)
      .subscribe({

        next: (response: any) => {
          debugger;

          this.isLoading = false;

          this.authMessage = response.message;

          console.log(response);


          setTimeout(() => {

            this.email = this.registerEmail;

            this.switchToLogin();


            this.firstName = '';
            this.lastName = '';
            this.registerEmail = '';
            this.registerPassword = '';

          }, 1200);

        },


        error: (error: any) => {

          this.isLoading = false;

          console.error(error);


          this.authMessage =
            error.error?.message || 'Registration failed';

        }

      });
  }



  handleLogout(): void {
    debugger;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.isAuthenticated = false;
    this.username = '';
    this.cartCount = 0;
    this.wishlistIds = [];
    this.email = '';
    this.password = '';
    this.authMessage = '';
  }

  // ==========================================================================
  // COMMERCE FLOW OPERATION HOOKS
  // ==========================================================================
  addToCart(product: Product): void {
    if (!this.isAuthenticated) {
      this.openAuthModal('cart', product);
      return;
    }

    this.cartCount++;
    this.authMessage = `"${product.name}" added to your cart.`;
  }

  buyNow(product: Product): void {
    if (!this.isAuthenticated) {
      this.openAuthModal('buy', product);
      return;
    }

    this.authMessage = `Proceeding to checkout for "${product.name}".`;
  }

  toggleWishlist(productId: number): void {
    const index = this.wishlistIds.indexOf(productId);
    if (index > -1) {
      this.wishlistIds.splice(index, 1);
    } else {
      this.wishlistIds.push(productId);
    }
  }

  private matchesFilters(product: Product): boolean {
    const matchesSearch = [
      product.name,
      product.brand,
      product.category
    ]
      .join(' ')
      .toLowerCase()
      .includes(this.searchTerm.toLowerCase());

    const matchesBrand =
      this.selectedBrand === 'All' ||
      product.brand === this.selectedBrand;

    const matchesCategory =
      this.selectedCategory === 'All' ||
      product.category === this.selectedCategory;

    const matchesRating = product.rating >= this.selectedRating;
    const matchesPrice = product.price <= this.maxPrice;

    return (
      matchesSearch &&
      matchesBrand &&
      matchesCategory &&
      matchesRating &&
      matchesPrice
    );
  }
}