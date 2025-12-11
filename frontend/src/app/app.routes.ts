import { Routes } from '@angular/router';
import { CarListComponent } from './components/car-list/car-list.component';
import { CarDetailComponent } from './components/car-detail/car-detail.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AdminCarListComponent } from './components/admin/admin-car-list/admin-car-list.component';
import { AdminCarFormComponent } from './components/admin/admin-car-form/admin-car-form.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: CarListComponent },
  { path: 'cars/:id', component: CarDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'admin/cars', 
    component: AdminCarListComponent,
    canActivate: [authGuard, adminGuard]
  },
  { 
    path: 'admin/cars/new', 
    component: AdminCarFormComponent,
    canActivate: [authGuard, adminGuard]
  },
  { 
    path: 'admin/cars/:id/edit', 
    component: AdminCarFormComponent,
    canActivate: [authGuard, adminGuard]
  },
  { path: '**', redirectTo: '' }
];

