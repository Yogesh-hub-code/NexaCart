import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService, UpdateProfileRequest, UpdatePasswordRequest } from '../../core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  // User info
  userId = 0;
  firstName = '';
  lastName = '';
  email = '';
  mobileNumber = '';
  roleName = '';

  // Password change
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  // UI state
  activeTab: 'info' | 'password' = 'info';
  isLoadingProfile = false;
  isSavingProfile = false;
  isSavingPassword = false;
  profileMsg = '';
  profileMsgType: 'success' | 'error' = 'success';
  passwordMsg = '';
  passwordMsgType: 'success' | 'error' = 'success';
  showCurrentPw = false;
  showNewPw = false;
  showConfirmPw = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('user');
    if (!stored) {
      this.router.navigate(['/']);
      return;
    }
    const user = JSON.parse(stored);
    this.userId = user.userId;
    this.roleName = user.roleName ?? '';
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoadingProfile = true;
    this.userService.getById(this.userId).subscribe({
      next: (data) => {
        this.firstName = data.firstName ?? '';
        this.lastName = data.lastName ?? '';
        this.email = data.email ?? '';
        this.mobileNumber = data.mobileNumber ?? '';
        this.isLoadingProfile = false;
      },
      error: () => {
        // Fallback to localStorage values if API unavailable
        const stored = localStorage.getItem('user');
        if (stored) {
          const u = JSON.parse(stored);
          this.firstName = u.firstName ?? '';
          this.lastName = u.lastName ?? '';
          this.email = u.email ?? '';
        }
        this.isLoadingProfile = false;
      }
    });
  }

  get initials(): string {
    return ((this.firstName?.[0] ?? '') + (this.lastName?.[0] ?? '')).toUpperCase() || '?';
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  saveProfile(): void {
    this.profileMsg = '';

    if (!this.firstName.trim()) {
      this.profileMsg = 'First name is required.';
      this.profileMsgType = 'error';
      return;
    }
    if (!this.lastName.trim()) {
      this.profileMsg = 'Last name is required.';
      this.profileMsgType = 'error';
      return;
    }
    if (!this.email.trim()) {
      this.profileMsg = 'Email is required.';
      this.profileMsgType = 'error';
      return;
    }

    const request: UpdateProfileRequest = {
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim(),
      mobileNumber: this.mobileNumber.trim()
    };

    this.isSavingProfile = true;

    this.userService.update(this.userId, request).subscribe({
      next: () => {
        this.isSavingProfile = false;
        this.profileMsg = 'Profile updated successfully.';
        this.profileMsgType = 'success';

        // Update localStorage
        const stored = localStorage.getItem('user');
        if (stored) {
          const u = JSON.parse(stored);
          u.firstName = this.firstName;
          u.lastName = this.lastName;
          u.email = this.email;
          localStorage.setItem('user', JSON.stringify(u));
        }
      },
      error: (err) => {
        this.isSavingProfile = false;
        this.profileMsg = err?.error?.message ?? 'Failed to update profile.';
        this.profileMsgType = 'error';
      }
    });
  }

  savePassword(): void {
    this.passwordMsg = '';

    if (!this.currentPassword.trim()) {
      this.passwordMsg = 'Please enter your current password.';
      this.passwordMsgType = 'error';
      return;
    }
    if (!this.newPassword.trim() || this.newPassword.length < 6) {
      this.passwordMsg = 'New password must be at least 6 characters.';
      this.passwordMsgType = 'error';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordMsg = 'Passwords do not match.';
      this.passwordMsgType = 'error';
      return;
    }

    const request: UpdatePasswordRequest = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };

    this.isSavingPassword = true;

    this.userService.updatePassword(this.userId, request).subscribe({
      next: () => {
        this.isSavingPassword = false;
        this.passwordMsg = 'Password changed successfully.';
        this.passwordMsgType = 'success';
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        this.isSavingPassword = false;
        this.passwordMsg = err?.error?.message ?? 'Failed to change password.';
        this.passwordMsgType = 'error';
      }
    });
  }
}
