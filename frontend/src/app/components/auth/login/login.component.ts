import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="card" style="max-width: 400px; margin: 50px auto;">
      <h2>Login</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email" 
            type="email" 
            formControlName="email"
            [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
          />
          <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="error-message">
            Valid email is required
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password" 
            type="password" 
            formControlName="password"
            [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
          />
          <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="error-message">
            Password is required
          </div>
        </div>

        <div *ngIf="errorMessage" class="error-message" style="margin-bottom: 15px;">
          {{ errorMessage }}
        </div>

        <button 
          type="submit" 
          class="btn btn-primary" 
          [disabled]="loginForm.invalid || loading"
          style="width: 100%;"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <p style="margin-top: 20px; text-align: center;">
        Don't have an account? <a routerLink="/register" style="color: #007bff;">Register here</a>
      </p>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Login failed. Please try again.';
          this.loading = false;
        }
      });
    }
  }
}

