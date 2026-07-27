import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { Brand, BrandService } from '../../core/services/brand.service';
import { AuthService } from '../../core/services/auth.service';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/product.service';
import { LoginRequest } from '../../core/models/login-request.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { LocationPickerComponent } from '../location-picker/location-picker.component';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductCardComponent, LocationPickerComponent],
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.css']
})
export class CategoryProductsComponent implements OnInit {

  // Data
  allProducts: Product[] = [];
  categories: Category[] = [];
  brandss: Brand[] = [];

  // Route state
  categoryId = 0;
  categoryName = '';

  // Filter & Search Controls
  searchTerm = '';
  sortBy = '';
  selectedBrand = 'All';
  maxPrice = 999999;
  selectedRating = 0;
  searchFocused = false;
  cartCount = 0;

  // UI state
  isLoading = false;
  showLocation = false;
  showProfileMenu = false;
  authMessage = '';
  currentLocation = 'Select Location';

  // Auth
  isAuthenticated = false;
  isAdmin = false;
  username = '';
  UserId = 0;
  showAuthModal = false;
  isSignUpMode = false;
  email = '';
  password = '';
  firstName = '';
  lastName = '';
  registerEmail = '';
  registerPassword = '';

  // Cart & Wishlist
  wishlistIds: number[] = [];
  selectedQuantity = 1;
  pendingProduct: Product | null = null;
  pendingAction: 'cart' | 'buy' | null = null;

  apiBaseUrl = 'https://localhost:7053';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private authService: AuthService,
    private CartService: CartService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.CartService.cartCount$.subscribe(count => this.cartCount = count);

    const user = localStorage.getItem('user');
    if (user) {
      const u = JSON.parse(user);
      this.isAuthenticated = true;
      this.username = u.firstName;
      this.UserId = u.userId;
      this.isAdmin = u.roleName === 'Admin';
    }

    this.getCurrentLocation();

    this.route.paramMap.subscribe(params => {
      this.categoryId = Number(params.get('id'));
      this.selectedBrand = 'All';
      this.loadAllData();
    });
  }

  private loadAllData(): void {
    this.isLoading = true;

    forkJoin({
      cats: this.categoryService.getAll(),
      brands: this.brandService.getAll(),
      prods: this.productService.getByCategory(this.categoryId)
    }).subscribe({
      next: ({ cats, brands, prods }) => {
        this.categories = cats;
        this.brandss = brands || [];
        this.updateCategoryName();
        this.allProducts = prods.map(p => this.normalizeProduct(p));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading = false;
      }
    });
  }

  private updateCategoryName(): void {
    const cat = this.categories.find(c => c.categoryId === this.categoryId);
    this.categoryName = cat?.name ?? `Category ${this.categoryId}`;
  }

  private normalizeProduct(p: Product): Product {
    const matchedBrand = this.brandss.find(b => Number(b.brandId) === Number(p.brandId));
    return {
      ...p,
      id: p.productId,
      brand: matchedBrand?.brandName ?? p.brand ?? 'Brand',
      category: this.categoryName,
      rating: Math.min(5, 3 + (p.productId % 3)),
      discount: 10 + (p.productId % 30),
      isNew: (p.stock ?? 0) > 0,
      badge: p.productId % 3 === 0 ? 'Trending' : ''
    };
  }

  get categoryBrands(): Brand[] {
    if (!this.brandss.length || !this.allProducts.length) return [];
    const activeCategoryBrandIds = new Set(
      this.allProducts.map(p => Number(p.brandId)).filter(id => !isNaN(id) && id > 0)
    );
    return this.brandss.filter(b => b.isActive && activeCategoryBrandIds.has(Number(b.brandId)));
  }

  selectBrandByName(brandName: string): void {
    this.selectedBrand = brandName;
  }

  getInitial(name: string | undefined | null): string {
    if (!name) return '??';
    return String(name).slice(0, 2).toUpperCase();
  }

  navigateToProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  get filteredProducts(): Product[] {
    return this.allProducts.filter(p => {
      const q = this.searchTerm.trim().toLowerCase();
      const matchSearch = !q || `${p.name} ${p.brand ?? ''}`.toLowerCase().includes(q);
      const activeMasterBrand = this.brandss.find(b => b.brandName === this.selectedBrand);
      const matchBrand =
        this.selectedBrand === 'All' ||
        p.brand === this.selectedBrand ||
        (activeMasterBrand && Number(p.brandId) === Number(activeMasterBrand.brandId));

      const matchRating = (p.rating ?? 0) >= this.selectedRating;
      const matchPrice = (p.price ?? 0) <= this.maxPrice;

      return matchSearch && matchBrand && matchRating && matchPrice;
    }).sort((a, b) => {
      if (this.sortBy === 'low') return a.price - b.price;
      if (this.sortBy === 'high') return b.price - a.price;
      if (this.sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
      return 0;
    });
  }

  get brands(): string[] {
    return ['All', ...new Set(this.allProducts.map(p => p.brand ?? '').filter(Boolean) as string[])];
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.sortBy = '';
    this.selectedBrand = 'All';
    this.selectedRating = 0;
    this.maxPrice = 999999;
  }

  selectCategory(id: number): void { this.router.navigate(['/products/category', id]); }
  navigateToAdmin(): void { this.showProfileMenu = false; this.router.navigate(['/admin']); }
  navigateToProfile(): void { this.showProfileMenu = false; this.router.navigate(['/profile']); }
  openCart(): void { this.authMessage = `You have ${this.cartCount} item(s) in your cart.`; }

  onLocationSelected(loc: string): void { this.currentLocation = loc; this.showLocation = false; }

  getCurrentLocation(): void {
    if (!navigator.geolocation) { this.currentLocation = 'Location unavailable'; return; }
    navigator.geolocation.getCurrentPosition(pos => {
      this.http.get<any>(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&accept-language=en`
      ).subscribe({
        next: r => {
          const a = r.address;
          const area = a.suburb || a.neighbourhood || a.city_district || a.town || a.city;
          const city = a.city || a.town || a.county;
          this.currentLocation = (area && city) ? `${area}, ${city}` : city || r.display_name;
        },
        error: () => { this.currentLocation = 'Location unavailable'; }
      });
    }, () => { this.currentLocation = 'Location unavailable'; });
  }

  openLoginModal(): void { this.isSignUpMode = false; this.authMessage = ''; this.showAuthModal = true; }
  closeAuthModal(): void {
    this.showAuthModal = false; this.isSignUpMode = false; this.authMessage = '';
    this.email = ''; this.password = ''; this.firstName = ''; this.lastName = '';
    this.registerEmail = ''; this.registerPassword = '';
    this.pendingAction = null; this.pendingProduct = null;
  }
  switchToSignUp(): void { this.isSignUpMode = true; this.authMessage = ''; }
  switchToLogin(): void { this.isSignUpMode = false; this.authMessage = ''; }

  openAuthModal(action: 'cart' | 'buy', product: Product): void {
    this.pendingAction = action; this.pendingProduct = product;
    this.isSignUpMode = false; this.authMessage = ''; this.showAuthModal = true;
  }

  handleAuth(): void {
    if (!this.email.trim() || !this.password.trim()) {
      this.authMessage = 'Please enter valid credentials.';
      return;
    }
    this.isLoading = true;
    const req: LoginRequest = { email: this.email.trim(), password: this.password };
    this.authService.login(req).subscribe({
      next: result => {
        this.isLoading = false;
        if (!result.success) { this.authMessage = result.message; return; }
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.isAuthenticated = true;
        this.username = result.user.firstName;
        this.isAdmin = result.user.roleName === 'Admin';
        this.closeAuthModal();
        if (this.pendingAction === 'cart' && this.pendingProduct) this.addToCart(this.pendingProduct);
        if (this.pendingAction === 'buy' && this.pendingProduct) this.buyNow(this.pendingProduct);
      },
      error: () => { this.isLoading = false; this.authMessage = 'Login failed. Check your credentials.'; }
    });
  }

  handleRegister(): void {
    if (!this.firstName || !this.lastName || !this.registerEmail || !this.registerPassword) {
      this.authMessage = 'Please fill all fields.';
      return;
    }
    this.isLoading = true;
    this.authService.register({
      firstName: this.firstName, lastName: this.lastName,
      email: this.registerEmail, password: this.registerPassword, roleId: 2
    }).subscribe({
      next: (r: any) => {
        this.isLoading = false;
        this.authMessage = r.message;
        setTimeout(() => { this.email = this.registerEmail; this.switchToLogin(); }, 1200);
      },
      error: (err: any) => { this.isLoading = false; this.authMessage = err.error?.message || 'Registration failed'; }
    });
  }

  handleLogout(): void {
    localStorage.removeItem('user'); localStorage.removeItem('token');
    this.isAuthenticated = false; this.isAdmin = false; this.username = '';
    this.cartCount = 0; this.wishlistIds = [];
  }

  addToCart(product: Product): void {
    if (!this.isAuthenticated) {
      this.openAuthModal('cart', product);
      return;
    }
    const userJson = localStorage.getItem('user');
    if (!userJson) return;
    const user = JSON.parse(userJson);

    this.CartService.addToCart({
      userId: user.userId,
      productId: product.productId,
      quantity: this.selectedQuantity || 1
    }).subscribe({
      next: () => {
        this.CartService.loadCartCount(user.userId);
        this.authMessage = `"${product.name}" added to cart!`;
      },
      error: () => {
        this.authMessage = "Unable to add product to cart.";
      }
    });
  }

  buyNow(product: Product): void {
    if (!this.isAuthenticated) { this.openAuthModal('buy', product); return; }
    this.addToCart(product);
    this.router.navigate(['/cart']);
  }

  toggleWishlist(productId: number): void {
    const i = this.wishlistIds.indexOf(productId);
    i > -1 ? this.wishlistIds.splice(i, 1) : this.wishlistIds.push(productId);
  }
  getBrandLogoUrl(brandName: string | null | undefined): string {
    debugger;
    if (!brandName) {
      return '';
    }

    // Converts brand name to lowercase without spaces (e.g., "Apple" -> "apple", "Top Brand" -> "top-brand")
    const fileName = brandName.toLowerCase().trim().replace(/\s+/g, '-');

    // Returns relative Angular asset path
    return `assets/brands/${fileName}.png`;
  }
}