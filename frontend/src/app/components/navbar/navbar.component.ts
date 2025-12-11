import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav style="background: white; padding: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <a routerLink="/" style="text-decoration: none; color: #333; font-size: 24px; font-weight: bold;">
          🚗 Car Sales
        </a>
        <div style="display: flex; gap: 15px; align-items: center;">
          <a routerLink="/" style="text-decoration: none; color: #333;">Cars</a>
          <ng-container *ngIf="!isAuthenticated()">
            <a routerLink="/login" style="text-decoration: none; color: #333;">Login</a>
            <a routerLink="/register" style="text-decoration: none; color: #333;">Register</a>
          </ng-container>
          <ng-container *ngIf="isAuthenticated()">
            <span style="color: #666;">{{ getUserEmail() }}</span>
            <ng-container *ngIf="isAdmin()">
              <a routerLink="/admin/cars" style="text-decoration: none; color: #333;">Admin</a>
            </ng-container>
            <button (click)="logout()" class="btn btn-secondary" style="padding: 5px 15px; font-size: 14px;">
              Logout
            </button>
          </ng-container>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getUserEmail(): string {
    const user = this.authService.getUser();
    return user?.email || '';
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/';
  }
}

