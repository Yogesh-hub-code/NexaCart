import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login(request: LoginRequest): { success: boolean; message: string } {
    const email = request.email.trim().toLowerCase();
    const password = request.password.trim();

    if (!email || !password) {
      return {
        success: false,
        message: 'Please enter both email and password.'
      };
    }

    if (email === 'admin@nexacart.com' && password === 'password123') {
      return {
        success: true,
        message: `Welcome back, ${email}!`
      };
    }

    return {
      success: false,
      message: 'Invalid credentials. Try admin@nexacart.com / password123.'
    };
  }
}
