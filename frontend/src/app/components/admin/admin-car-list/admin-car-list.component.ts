import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminCarsService } from '../../../services/admin-cars.service';
import { Car } from '../../../models/car.model';

@Component({
  selector: 'app-admin-car-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h1>Admin - Car Management</h1>
        <a routerLink="/admin/cars/new" class="btn btn-primary">Add New Car</a>
      </div>

      <div *ngIf="loading" style="text-align: center; padding: 20px;">
        Loading...
      </div>

      <div *ngIf="!loading && cars.length === 0" style="text-align: center; padding: 20px; color: #666;">
        No cars found. <a routerLink="/admin/cars/new">Add your first car</a>
      </div>

      <div *ngIf="!loading && cars.length > 0">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Make</th>
              <th>Model</th>
              <th>Year</th>
              <th>Price</th>
              <th>Mileage</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let car of cars" [style.opacity]="car.isActive ? '1' : '0.6'">
              <td>{{ car.id }}</td>
              <td>{{ car.make }}</td>
              <td>{{ car.model }}</td>
              <td>{{ car.year }}</td>
              <td>\${{ car.price | number:'1.2-2' }}</td>
              <td>{{ car.mileage | number }} mi</td>
              <td>
                <span [style.color]="car.isActive ? 'green' : 'red'">
                  {{ car.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <a [routerLink]="['/admin/cars', car.id, 'edit']" class="btn btn-primary" style="padding: 5px 15px; font-size: 12px; margin-right: 5px;">
                  Edit
                </a>
                <button 
                  (click)="deleteCar(car.id)" 
                  class="btn btn-danger" 
                  style="padding: 5px 15px; font-size: 12px;"
                  [disabled]="!car.isActive"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminCarListComponent implements OnInit {
  cars: Car[] = [];
  loading = false;

  constructor(private adminCarsService: AdminCarsService) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.loading = true;
    this.adminCarsService.getAllCars().subscribe({
      next: (cars) => {
        this.cars = cars;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading cars:', err);
        this.loading = false;
      }
    });
  }

  deleteCar(id: number): void {
    if (confirm('Are you sure you want to delete this car?')) {
      this.adminCarsService.deleteCar(id).subscribe({
        next: () => {
          this.loadCars();
        },
        error: (err) => {
          console.error('Error deleting car:', err);
          alert('Failed to delete car. Please try again.');
        }
      });
    }
  }
}

