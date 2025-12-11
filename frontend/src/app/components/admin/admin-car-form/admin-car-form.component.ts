import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminCarsService } from '../../../services/admin-cars.service';

@Component({
  selector: 'app-admin-car-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div style="max-width: 600px; margin: 20px auto; padding: 20px;">
      <div style="background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px;">
        <h2 style="margin-top: 0;">{{ isEditMode ? 'Edit Car' : 'Add New Car' }}</h2>
        
        <form [formGroup]="carForm" (ngSubmit)="onSubmit()">
          <!-- Make -->
          <div style="margin-bottom: 20px;">
            <label for="make" style="display: block; margin-bottom: 5px; font-weight: 500;">Make *</label>
            <input 
              id="make" 
              type="text" 
              formControlName="make"
              placeholder="Toyota"
              style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;"
              [style.border-color]="getFieldError('make') ? '#dc3545' : '#ddd'"
            />
            <div *ngIf="getFieldError('make')" style="color: #dc3545; font-size: 0.85em; margin-top: 5px;">
              Make is required
            </div>
          </div>

          <!-- Model -->
          <div style="margin-bottom: 20px;">
            <label for="model" style="display: block; margin-bottom: 5px; font-weight: 500;">Model *</label>
            <input 
              id="model" 
              type="text" 
              formControlName="model"
              placeholder="Camry"
              style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;"
              [style.border-color]="getFieldError('model') ? '#dc3545' : '#ddd'"
            />
            <div *ngIf="getFieldError('model')" style="color: #dc3545; font-size: 0.85em; margin-top: 5px;">
              Model is required
            </div>
          </div>

          <!-- Year -->
          <div style="margin-bottom: 20px;">
            <label for="year" style="display: block; margin-bottom: 5px; font-weight: 500;">Year *</label>
            <input 
              id="year" 
              type="number" 
              formControlName="year"
              placeholder="2022"
              style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;"
              [style.border-color]="getFieldError('year') ? '#dc3545' : '#ddd'"
            />
            <div *ngIf="getFieldError('year')" style="color: #dc3545; font-size: 0.85em; margin-top: 5px;">
              Valid year required (1900-2100)
            </div>
          </div>

          <!-- Price -->
          <div style="margin-bottom: 20px;">
            <label for="price" style="display: block; margin-bottom: 5px; font-weight: 500;">Price (USD) *</label>
            <input 
              id="price" 
              type="number" 
              step="0.01"
              formControlName="price"
              placeholder="25000"
              style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;"
              [style.border-color]="getFieldError('price') ? '#dc3545' : '#ddd'"
            />
            <div *ngIf="getFieldError('price')" style="color: #dc3545; font-size: 0.85em; margin-top: 5px;">
              Valid price required (min $0)
            </div>
          </div>

          <!-- Mileage -->
          <div style="margin-bottom: 20px;">
            <label for="mileage" style="display: block; margin-bottom: 5px; font-weight: 500;">Mileage (miles) *</label>
            <input 
              id="mileage" 
              type="number" 
              formControlName="mileage"
              placeholder="45000"
              style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;"
              [style.border-color]="getFieldError('mileage') ? '#dc3545' : '#ddd'"
            />
            <div *ngIf="getFieldError('mileage')" style="color: #dc3545; font-size: 0.85em; margin-top: 5px;">
              Valid mileage required (min 0)
            </div>
          </div>

          <!-- Description -->
          <div style="margin-bottom: 20px;">
            <label for="description" style="display: block; margin-bottom: 5px; font-weight: 500;">Description</label>
            <textarea 
              id="description" 
              formControlName="description"
              rows="4"
              placeholder="Car condition, maintenance history, etc."
              style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box; font-family: inherit;"
            ></textarea>
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage" style="background-color: #fee; color: #dc3545; padding: 12px; border-radius: 4px; margin-bottom: 20px; border: 1px solid #fcc;">
            {{ errorMessage }}
          </div>

          <!-- Buttons -->
          <div style="display: flex; gap: 10px;">
            <button 
              type="submit" 
              [disabled]="carForm.invalid || loading"
              style="flex: 1; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; font-size: 14px;"
              [style.opacity]="carForm.invalid || loading ? '0.5' : '1'"
              [style.cursor]="carForm.invalid || loading ? 'not-allowed' : 'pointer'"
            >
              {{ loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
            </button>
            <button 
              type="button" 
              (click)="cancel()"
              style="flex: 1; padding: 10px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; font-size: 14px;"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AdminCarFormComponent implements OnInit {
  carForm: FormGroup;
  isEditMode = false;
  carId?: number;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminCarsService: AdminCarsService
  ) {
    this.carForm = this.fb.group({
      make: ['', [Validators.required]],
      model: ['', [Validators.required]],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(2100)]],
      price: ['', [Validators.required, Validators.min(0)]],
      mileage: ['', [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.carId = +id;
      this.loadCar(+id);
    }
  }

  loadCar(id: number): void {
    this.loading = true;
    this.adminCarsService.getCar(id).subscribe({
      next: (car: any) => {
        this.carForm.patchValue({
          make: car.make,
          model: car.model,
          year: car.year,
          price: car.price,
          mileage: car.mileage,
          description: car.description
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading car:', err);
        this.errorMessage = 'Failed to load car.';
        this.loading = false;
      }
    });
  }

  getFieldError(fieldName: string): boolean {
    const control = this.carForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit(): void {
    if (this.carForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const carData = this.carForm.value;

      const operation = this.isEditMode && this.carId
        ? this.adminCarsService.updateCar(this.carId, carData)
        : this.adminCarsService.createCar(carData);

      operation.subscribe({
        next: () => {
          this.router.navigate(['/admin/cars']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to save car.';
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/cars']);
  }
}

