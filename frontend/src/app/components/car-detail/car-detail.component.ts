import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CarsService } from '../../services/cars.service';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card">
      <button (click)="goBack()" class="btn btn-secondary" style="margin-bottom: 20px;">
        ← Back to List
      </button>

      <div *ngIf="loading" style="text-align: center; padding: 20px;">
        Loading...
      </div>

      <div *ngIf="!loading && car">
        <h1>{{ car.make }} {{ car.model }}</h1>
        <div style="margin-top: 20px;">
          <p><strong>Year:</strong> {{ car.year }}</p>
          <p><strong>Price:</strong> \${{ car.price | number:'1.2-2' }}</p>
          <p><strong>Mileage:</strong> {{ car.mileage | number }} miles</p>
          <p><strong>Description:</strong></p>
          <p style="white-space: pre-wrap; background: #f8f9fa; padding: 15px; border-radius: 4px;">
            {{ car.description || 'No description available.' }}
          </p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Listed on: {{ car.createdAt | date:'medium' }}
          </p>
        </div>
      </div>

      <div *ngIf="!loading && !car" style="text-align: center; padding: 20px; color: #dc3545;">
        Car not found.
      </div>
    </div>
  `
})
export class CarDetailComponent implements OnInit {
  car?: Car;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private carsService: CarsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCar(+id);
    }
  }

  loadCar(id: number): void {
    this.loading = true;
    this.carsService.getCar(id).subscribe({
      next: (car) => {
        this.car = car;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading car:', err);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    window.history.back();
  }
}

