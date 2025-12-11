import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="card" style="max-width: 400px; margin: 50px auto;">
      <h2>Register</h2>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email" 
            type="email" 
            formControlName="email"
            [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
          />
          <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="error-message">
            Valid email is required
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password" 
            type="password" 
            formControlName="password"
            [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
          />
          <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="error-message">
            Password must be at least 6 characters
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input 
            id="confirmPassword" 
            type="password" 
            formControlName="confirmPassword"
            [class.error]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
          />
          <div *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched" class="error-message">
            Passwords must match
          </div>
        </div>

        <div *ngIf="errorMessage" class="error-message" style="margin-bottom: 15px;">
          {{ errorMessage }}
        </div>

        <button 
          type="submit" 
          class="btn btn-primary" 
          [disabled]="registerForm.invalid || loading"
          style="width: 100%;"
        >
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>

      <p style="margin-top: 20px; text-align: center;">
        Already have an account? <a routerLink="/login" style="color: #007bff;">Login here</a>
      </p>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { email, password } = this.registerForm.value;
      this.authService.register(email, password).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
          this.loading = false;
        }
      });
    }
  }
}

