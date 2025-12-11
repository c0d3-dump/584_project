# Project File Structure

## Complete Directory Tree

```
584_project/
│
├── 584_project.sln                          # Visual Studio Solution file
├── README.md                                 # Project documentation
├── FILE_STRUCTURE.md                        # This file
│
├── backend/
│   └── CarSalesAPI/                         # ASP.NET Core 9 Web API
│       ├── Dockerfile                       # Docker configuration
│       ├── .dockerignore                    # Docker ignore patterns
│       ├── .gitignore                       # Git ignore patterns
│       ├── CarSalesAPI.csproj               # Project file (NuGet packages)
│       ├── Program.cs                       # Application entry point & configuration
│       ├── appsettings.json                 # Configuration (production)
│       ├── appsettings.Development.json     # Configuration (development)
│       ├── carsales.db                      # SQLite database file
│       │
│       ├── Properties/
│       │   └── launchSettings.json          # Launch profiles (HTTP/HTTPS ports)
│       │
│       ├── Controllers/
│       │   ├── AuthController.cs            # Auth endpoints (login, register)
│       │   ├── CarsController.cs            # Public car endpoints (GET)
│       │   └── Admin/
│       │       └── CarsController.cs        # Admin car endpoints (CRUD)
│       │
│       ├── Models/
│       │   ├── User.cs                      # User entity (Email, PasswordHash, Role)
│       │   └── Car.cs                       # Car entity (Make, Model, Year, Price, etc.)
│       │
│       ├── Data/
│       │   ├── ApplicationDbContext.cs      # EF Core DbContext
│       │   ├── DbInitializer.cs             # Seed database with sample data
│       │   └── EmailNormalizer.cs           # Email normalization utility
│       │
│       ├── DTOs/
│       │   ├── AuthResponseDto.cs           # Response: token, user info
│       │   ├── LoginDto.cs                  # Request: email, password
│       │   ├── RegisterDto.cs               # Request: email, password
│       │   ├── CarDto.cs                    # Response: car details
│       │   ├── CreateCarDto.cs              # Request: create car
│       │   └── UpdateCarDto.cs              # Request: update car
│       │
│       ├── Services/
│       │   ├── IAuthService.cs              # Interface: authentication logic
│       │   └── AuthService.cs               # Implementation: JWT, password hashing
│       │
│       └── Scripts/
│           └── CreateAdminUser.cs           # Utility: create admin user
│
├── frontend/                                 # Angular 20 Single Page App
│   ├── angular.json                         # Angular CLI configuration
│   ├── package.json                         # NPM dependencies
│   ├── package-lock.json                    # Locked dependency versions
│   ├── tsconfig.json                        # TypeScript configuration (base)
│   ├── tsconfig.app.json                    # TypeScript configuration (app)
│   ├── .gitignore                           # Git ignore patterns
│   │
│   └── src/
│       ├── index.html                       # Main HTML file
│       ├── main.ts                          # Application bootstrap
│       ├── styles.css                       # Global styles
│       ├── favicon.ico                      # Browser icon
│       │
│       └── app/
│           ├── app.component.ts             # Root component
│           ├── app.routes.ts                # Route definitions
│           │
│           ├── components/
│           │   ├── navbar/
│           │   │   └── navbar.component.ts  # Navigation bar (login/logout/admin)
│           │   │
│           │   ├── auth/
│           │   │   ├── login/
│           │   │   │   └── login.component.ts    # Login form
│           │   │   └── register/
│           │   │       └── register.component.ts # Registration form
│           │   │
│           │   ├── car-list/
│           │   │   └── car-list.component.ts     # Public car list (search, filter, pagination)
│           │   │
│           │   ├── car-detail/
│           │   │   └── car-detail.component.ts   # Single car details page
│           │   │
│           │   └── admin/
│           │       ├── admin-car-list/
│           │       │   └── admin-car-list.component.ts    # Admin: list all cars
│           │       └── admin-car-form/
│           │           └── admin-car-form.component.ts    # Admin: create/edit car (Reactive Forms)
│           │
│           ├── services/
│           │   ├── auth.service.ts          # Authentication service (login, register, logout)
│           │   ├── cars.service.ts          # Public cars API calls
│           │   └── admin-cars.service.ts    # Admin cars API calls (CRUD)
│           │
│           ├── guards/
│           │   ├── auth.guard.ts            # Protects routes requiring login
│           │   └── admin.guard.ts           # Protects admin routes (role check)
│           │
│           ├── interceptors/
│           │   └── auth.interceptor.ts      # Injects JWT token in all requests
│           │
│           └── models/
│               ├── car.model.ts             # Car interface & DTOs
│               └── user.model.ts            # User interface & login response
│
└── .DS_Store                                # macOS system file (ignore)
```

---

## File Count Summary

| Category | Count | Location |
|----------|-------|----------|
| **Backend Files** | 22 | `backend/CarSalesAPI/` |
| **Frontend Files** | 25 | `frontend/src/` |
| **Config Files** | 5 | Root & config folders |
| **Total** | ~52 | Excluding node_modules, bin, obj, dist |

---

## Key Files by Purpose

### Authentication
- `backend/CarSalesAPI/Services/AuthService.cs` - JWT creation & validation
- `frontend/src/app/services/auth.service.ts` - Login/register calls
- `frontend/src/app/guards/auth.guard.ts` - Route protection

### Cars Management
- `backend/CarSalesAPI/Controllers/CarsController.cs` - Public endpoints
- `backend/CarSalesAPI/Controllers/Admin/CarsController.cs` - Admin CRUD
- `frontend/src/app/components/admin/admin-car-form/admin-car-form.component.ts` - Reactive form with validation

### Database
- `backend/CarSalesAPI/Models/Car.cs` - Car entity
- `backend/CarSalesAPI/Models/User.cs` - User entity
- `backend/CarSalesAPI/Data/ApplicationDbContext.cs` - EF Core context

### API Communication
- `frontend/src/app/interceptors/auth.interceptor.ts` - Injects JWT token
- `frontend/src/app/services/cars.service.ts` - HTTP calls for public cars
- `frontend/src/app/services/admin-cars.service.ts` - HTTP calls for admin

### Deployment
- `backend/CarSalesAPI/Dockerfile` - Docker image for backend
- `backend/CarSalesAPI/.dockerignore` - Exclude files from Docker build
- `frontend/angular.json` - Build configuration for `ng build`

---

## Folder Purposes

| Folder | Purpose |
|--------|---------|
| `Controllers/` | API route handlers (endpoints) |
| `Models/` | Database entity classes |
| `DTOs/` | Data Transfer Objects (API payloads) |
| `Data/` | Database context & initialization |
| `Services/` | Business logic (auth, car operations) |
| `guards/` | Route protection (auth, admin checks) |
| `interceptors/` | HTTP middleware (add JWT token) |
| `components/` | UI components (forms, lists, pages) |
| `services/` | API client services |
| `models/` | TypeScript interfaces |

---

## Database Schema (SQLite)

### Users Table
```
┌─────────────────┬──────────┬─────────────┐
│ Column          │ Type     │ Notes       │
├─────────────────┼──────────┼─────────────┤
│ Id              │ int      │ Primary Key │
│ Email           │ string   │ Unique      │
│ PasswordHash    │ string   │             │
│ Role            │ string   │ "Admin"/"User" │
│ CreatedAt       │ datetime │             │
└─────────────────┴──────────┴─────────────┘
```

### Cars Table
```
┌─────────────────┬──────────┬──────────────────────┐
│ Column          │ Type     │ Notes                │
├─────────────────┼──────────┼──────────────────────┤
│ Id              │ int      │ Primary Key          │
│ Make            │ string   │ e.g., "Toyota"      │
│ Model           │ string   │ e.g., "Camry"       │
│ Year            │ int      │ e.g., 2022          │
│ Price           │ decimal  │ e.g., 25000.00      │
│ Mileage         │ int      │ e.g., 45000         │
│ Description     │ text     │ Optional            │
│ CreatedAt       │ datetime │                      │
│ UpdatedAt       │ datetime │                      │
│ IsActive        │ bool     │ Soft delete flag     │
└─────────────────┴──────────┴──────────────────────┘
```

---

## Routes & Endpoints

### Frontend Routes
```
/                           → Car list (public)
/cars/:id                   → Car detail (public)
/login                      → Login page
/register                   → Register page
/admin/cars                 → Admin car list
/admin/cars/new             → Create new car
/admin/cars/:id/edit        → Edit car
```

### Backend API Routes
```
POST   /api/auth/register        → Register user
POST   /api/auth/login           → Login & get JWT
GET    /api/cars                 → Get public cars (paginated)
GET    /api/cars/:id             → Get car details
GET    /api/admin/cars           → Get all cars (admin only)
POST   /api/admin/cars           → Create car (admin only)
PUT    /api/admin/cars/:id       → Update car (admin only)
DELETE /api/admin/cars/:id       → Delete car (admin only)
GET    /swagger                  → API documentation
```

---

## Dependencies Summary

### Backend (C# / .NET 9)
- `Microsoft.EntityFrameworkCore` - ORM
- `Microsoft.EntityFrameworkCore.Sqlite` - SQLite provider
- `Microsoft.AspNetCore.Authentication.JwtBearer` - JWT auth
- `BCrypt.Net-Next` - Password hashing
- `Swashbuckle.AspNetCore` - Swagger/OpenAPI

### Frontend (TypeScript / Angular 20)
- `@angular/core` - Core framework
- `@angular/forms` - Reactive & template forms
- `@angular/router` - Routing
- `@angular/common` - Common utilities
- `rxjs` - Reactive programming

---

## Quick Navigation

| Need | File |
|------|------|
| Add new API endpoint | `Controllers/` |
| Modify car data | `Models/Car.cs` |
| Change JWT settings | `appsettings.json` |
| Create new form | `components/admin/` |
| Add new service | `services/` |
| Protect a route | `guards/` |
| Change API URL | `services/` |
| Database queries | `Data/ApplicationDbContext.cs` |

