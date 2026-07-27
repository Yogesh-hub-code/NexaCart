import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductCardComponent } from '../product-card/product-card.component';
import { LoginRequest } from '../../core/models/login-request.model';
import { Product } from '../../core/models/product.model';

import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';
import { Brand, BrandService } from '../../core/services/brand.service';
import { HttpClient } from '@angular/common/http';
import { LocationPickerComponent } from '../location-picker/location-picker.component';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductCardComponent, LocationPickerComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  searchTerm = '';
  selectedBrand = 'All';
  selectedCategory = 'All';
  selectedRating = 0;
  maxPrice = 999999;
  searchFocused = false;
  showProfileMenu = false;
  categories: Category[] = [];
  productCategories: Category[] = [];
  popularBrands: string[] = [];
  featuredSections: Array<{ category: string; title: string; subtitle: string }> = [];
  brandss: Brand[] = [];
  selectedBrandId: number | null = null;

  // Authentication states
  isAuthenticated = false;
  isAdmin = false;
  isLoading = false;
  showAuthModal = false;
  authMessage = '';
  username = '';

  UserId = 0;

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

  currentLocation: string = 'Fetching location...';
  showLocation = false;

  apiBaseUrl = 'https://localhost:7053';

  // Dynamic Countdown Timer State
  timerHours = 16;
  timerMinutes = 24;
  timerSeconds = 8;
  private timerInterval: any;

  // Cartoon badge variations
  funBadges = [
    { label: '🔥 HOT DROP', icon: '⚡' },
    { label: '🎉 CRAZY DEAL', icon: '🎈' },
    { label: '💥 SUPER SAVER', icon: '🚀' },
    { label: '⭐ TOP RATED', icon: '🌟' }
  ];
  cartCountSubject: any;

  constructor(
    private readonly productService: ProductService,
    private readonly authService: AuthService,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
    private readonly cartService: CartService,
    private readonly router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    debugger;

    const user = localStorage.getItem('user');

    if (user) {
      const currentUser = JSON.parse(user);
      this.isAuthenticated = true;
      this.username = currentUser.firstName;
      this.UserId = currentUser.userId;
      this.isAdmin = currentUser.roleName === 'Admin';

      // Load cart count
      this.cartService.loadCartCount(this.UserId);
    }

    this.cartService.cartCount$
      .subscribe(count => {
        this.cartCount = count;
      });

    this.loadHomeData();
    this.getCurrentLocation();
    this.startCountdownTimer();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private startCountdownTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.timerSeconds > 0) {
        this.timerSeconds--;
      } else {
        this.timerSeconds = 59;
        if (this.timerMinutes > 0) {
          this.timerMinutes--;
        } else {
          this.timerMinutes = 59;
          if (this.timerHours > 0) {
            this.timerHours--;
          } else {
            this.timerHours = 23;
          }
        }
      }
    }, 1000);
  }

  formatTime(value: number): string {
    return value.toString().padStart(2, '0');
  }

  // Get 4 dynamic deal products mixed from available API products
  get dealProducts(): Product[] {
    if (!this.products || this.products.length === 0) return [];
    return this.products.slice(0, 4);
  }

  // Get 1 featured flagship product for the promo banner
  get featuredHeroProduct(): Product | null {
    if (!this.products || this.products.length === 0) return null;
    return this.products[4] || this.products[0];
  }

  // Dynamic Top Promo Cards (picks 3 featured products from your API data)
  get promoProducts(): Product[] {
    if (!this.products || this.products.length < 3) return [];
    return this.products.slice(0, 3);
  }

  // Dynamic Personalized Recommendations (picks 4 products from your API data)
  get recoProducts(): Product[] {
    if (!this.products || this.products.length === 0) return [];
    return this.products.slice(3, 7);
  }

  loadCartCount(userId: number) {
    debugger;

    this.cartService.getCart(userId)
      .subscribe({
        next: (cart: any) => {
          console.log("Cart Response:", cart);
          const count = cart.item.items.length;
          console.log("Cart Count:", count);
          if (this.cartCountSubject) {
            this.cartCountSubject.next(count);
          }
        },
        error: (err) => {
          console.error("Cart Count Error:", err);
          if (this.cartCountSubject) {
            this.cartCountSubject.next(0);
          }
        }
      });
  }

  navigateToProduct(productId: number): void {
    debugger;
    this.router.navigate(['/products', productId]);
  }

  // Robust image path cleaner handling Windows backslashes & apiBaseUrl
  getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) {
      return 'https://via.placeholder.com/400x300';
    }

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Replace Windows backslashes (\) with web slashes (/)
    const normalizedPath = imagePath.replace(/\\/g, '/');
    const baseUrl = this.apiBaseUrl.endsWith('/') ? this.apiBaseUrl.slice(0, -1) : this.apiBaseUrl;
    const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;

    return `${baseUrl}${cleanPath}`;
  }

  onLocationSelected(location: string) {
    this.currentLocation = location;
    this.showLocation = false;
  }

  openLocationSelector(): void {
    const location = prompt('Enter your city');
    if (location && location.trim()) {
      this.currentLocation = location.trim();
    }
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          this.http.get<any>(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`
          ).subscribe({
            next: (response) => {
              const a = response.address;
              const area =
                a.suburb ||
                a.neighbourhood ||
                a.residential ||
                a.city_district ||
                a.quarter ||
                a.hamlet ||
                a.village ||
                a.town ||
                a.city;

              const city =
                a.city ||
                a.town ||
                a.village ||
                a.county;

              if (area && city) {
                this.currentLocation = `${area}, ${city}`;
              } else if (city) {
                this.currentLocation = city;
              } else {
                this.currentLocation = response.display_name;
              }
            },
            error: () => {
              this.currentLocation = 'Location unavailable';
            }
          });
        },
        () => {
          this.currentLocation = 'Location unavailable';
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      this.currentLocation = 'Geolocation not supported';
    }
  }

  private loadHomeData(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories.map(category => ({
          ...category,
          icon: this.categoryIcon(category.name)
        }));

        this.productCategories = this.categories;

        this.featuredSections = this.categories.slice(0, 3).map(category => ({
          category: category.name,
          title: `${category.name} Essentials`,
          subtitle: `Featured ${category.name.toLowerCase()} picks`
        }));
      },
      error: err => console.error(err)
    });

    this.productService.getAll().subscribe({
      next: (products) => {
        console.log("API PRODUCTS:", products);
        this.products = products.map(product =>
          this.normalizeProduct(product)
        );

        console.log("NORMALIZED:", this.products);

        this.popularBrands = [
          'All',
          ...new Set(
            this.products
              .map(x => x.brand ?? '')
              .filter(Boolean)
          )
        ];
      },
      error: err => console.error(err)
    });

    this.brandService.getAll().subscribe({
      next: brands => {
        console.log("BRANDS:", brands);
        this.brandss = brands;
      },
      error: err => console.error(err)
    });
  }

  addToCart(product: Product): void {
    debugger;

    if (!this.isAuthenticated) {
      this.openAuthModal('cart', product);
      return;
    }

    const user = JSON.parse(
      localStorage.getItem('user')!
    );

    const request = {
      UserId: user.userId,
      productId: product.productId,
      quantity: 1
    };

    this.cartService.addToCart(request)
      .subscribe({
        next: (response) => {
          // Refresh count from API
          this.cartService.loadCartCount(user.userId);
          this.authMessage = `${product.name} added to cart`;
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  // ==========================================================================
  // FILTERS & COMPUTED PROPERTY GETTERS
  // ==========================================================================

  selectCategory(categoryId: number): void {
    this.router.navigate(['/products/category', categoryId]);
  }

  selectBrand(brandId: number): void {
    this.selectedBrandId = brandId;
  }

  private categoryIcon(categoryName: string): string {
    const iconMap: Record<string, string> = {
      electronics: '💻',
      fashion: '👗',
      home: '🏠',
      sports: '🏀',
      health: '🩺'
    };

    return iconMap[categoryName.toLowerCase()] || '📦';
  }

  private normalizeProduct(product: Product): Product {
    return {
      ...product,
      id: product.productId,
      brand: this.brandForProduct(product),
      category: this.categoryNameForProduct(product),
      rating: this.ratingForProduct(product),
      discount: this.discountForProduct(product),
      isNew: (product.stock ?? 0) > 0,
      badge: product.productId % 3 === 0 ? 'Trending' : ''
    };
  }

  private brandForProduct(product: Product): string {
    const brands = ['Apple', 'Samsung', 'Sony', 'Nike', 'Google', 'HP', 'Microsoft'];
    const index = (product.brandId ?? product.productId ?? 0) % brands.length;
    return brands[index] || 'Top Brand';
  }

  private categoryNameForProduct(product: Product): string {
    return this.categories.find(x => x.categoryId === product.categoryId)?.name || 'Other';
  }

  private ratingForProduct(product: Product): number {
    return Math.min(5, 3 + ((product.productId ?? 0) % 3) + ((product.stock ?? 0) % 2));
  }

  private discountForProduct(product: Product): number {
    return 10 + ((product.productId ?? 0) % 30);
  }

  get filteredProducts(): Product[] {
    return this.products.filter(product => this.matchesFilters(product));
  }

  get trendingProducts(): Product[] {
    return this.filteredProducts
      .filter(x => x.badge === 'Trending')
      .slice(0, 4);
  }

  get dealsProducts(): Product[] {
    return this.filteredProducts
      .filter(x => (x.discount ?? 0) >= 20)
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
      ...new Set(this.products.map(x => x.brand ?? '').filter(Boolean) as string[])
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

        if (!result.success) {
          this.authMessage = result.message;
          return;
        }

        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.isAuthenticated = true;
        this.username = result.user.firstName;
        this.authMessage = result.message;
        this.isAdmin = result.user.roleName === 'Admin';

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

  navigateToAdmin(): void {
    this.showProfileMenu = false;
    this.router.navigate(['/admin']);
  }

  navigateToProfile(): void {
    this.showProfileMenu = false;
    this.router.navigate(['/profile']);
  }

  handleLogout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.username = '';
    this.cartCount = 0;
    this.wishlistIds = [];
    this.email = '';
    this.password = '';
    this.authMessage = '';
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

    const matchesRating = (product.rating ?? 0) >= this.selectedRating;
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