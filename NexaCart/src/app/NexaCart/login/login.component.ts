import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/models/login-request.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';
  isError = false;
  loginInProgress = false;

  constructor(private authService: AuthService) {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      this.message = 'Please fill in both email and password.';
      this.isError = true;
      return;
    }

    this.loginInProgress = true;

    const request: LoginRequest = {
      email: this.email,
      password: this.password
    };

    const result = this.authService.login(request);
    this.loginInProgress = false;
    this.message = result.message;
    this.isError = !result.success;

    if (result.success) {
      this.password = '';
      form.form.markAsPristine();
      form.form.markAsUntouched();
    }
  }
}
