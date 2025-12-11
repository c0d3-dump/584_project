import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CarsService } from '../../services/cars.service';
import { Car, PagedResult } from '../../models/car.model';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="card">
      <h1>Available Cars</h1>
      
      <div style="margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          placeholder="Search by make, model, or description..."
          style="flex: 1; min-width: 200px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px;"
        />
        <input 
          type="text" 
          [(ngModel)]="makeFilter" 
          placeholder="Filter by make..."
          style="flex: 1; min-width: 150px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px;"
        />
        <input 
          type="number" 
          [(ngModel)]="minYearFilter" 
          placeholder="Min Year"
          style="width: 100px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px;"
        />
        <input 
          type="number" 
          [(ngModel)]="maxYearFilter" 
          placeholder="Max Year"
          style="width: 100px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px;"
        />
        <input 
          type="number" 
          [(ngModel)]="minPriceFilter" 
          placeholder="Min Price"
          style="width: 120px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px;"
        />
        <input 
          type="number" 
          [(ngModel)]="maxPriceFilter" 
          placeholder="Max Price"
          style="width: 120px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px;"
        />
        <button (click)="loadCars()" class="btn btn-primary">Search</button>
        <button (click)="clearFilters()" class="btn btn-secondary">Clear</button>
      </div>

      <div *ngIf="loading" style="text-align: center; padding: 20px;">
        Loading...
      </div>

      <div *ngIf="!loading && cars.length === 0" style="text-align: center; padding: 20px; color: #666;">
        No cars found.
      </div>

      <div *ngIf="!loading && cars.length > 0">
        <table class="table">
          <thead>
            <tr>
              <th>Make</th>
              <th>Model</th>
              <th>Year</th>
              <th>Price</th>
              <th>Mileage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let car of cars">
              <td>{{ car.make }}</td>
              <td>{{ car.model }}</td>
              <td>{{ car.year }}</td>
              <td>\${{ car.price | number:'1.2-2' }}</td>
              <td>{{ car.mileage | number }} mi</td>
              <td>
                <a [routerLink]="['/cars', car.id]" class="btn btn-primary" style="padding: 5px 15px; font-size: 12px;">
                  View Details
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pagination" *ngIf="pagedResult">
          <button (click)="previousPage()" [disabled]="currentPage === 1">Previous</button>
          <span class="current-page">Page {{ currentPage }} of {{ pagedResult.totalPages }}</span>
          <button (click)="nextPage()" [disabled]="currentPage >= pagedResult.totalPages">Next</button>
        </div>
      </div>
    </div>
  `
})
export class CarListComponent implements OnInit {
  cars: Car[] = [];
  loading = false;
  searchTerm = '';
  makeFilter = '';
  minYearFilter?: number;
  maxYearFilter?: number;
  minPriceFilter?: number;
  maxPriceFilter?: number;
  currentPage = 1;
  pageSize = 10;
  pagedResult?: PagedResult<Car>;

  constructor(private carsService: CarsService) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.loading = true;
    this.carsService.getCars(
      this.searchTerm || undefined,
      this.makeFilter || undefined,
      this.minYearFilter,
      this.maxYearFilter,
      this.minPriceFilter,
      this.maxPriceFilter,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (result) => {
        this.cars = result.items;
        this.pagedResult = result;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading cars:', err);
        this.loading = false;
      }
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.makeFilter = '';
    this.minYearFilter = undefined;
    this.maxYearFilter = undefined;
    this.minPriceFilter = undefined;
    this.maxPriceFilter = undefined;
    this.currentPage = 1;
    this.loadCars();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCars();
    }
  }

  nextPage(): void {
    if (this.pagedResult && this.currentPage < this.pagedResult.totalPages) {
      this.currentPage++;
      this.loadCars();
    }
  }
}

