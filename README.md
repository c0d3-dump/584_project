# Old Car Sales Management App

A full-stack application for managing old car sales with role-based access control (Admin and User roles).

## Tech Stack

- **Frontend**: Angular 20 (TypeScript, Reactive Forms, HttpClient)
- **Backend**: ASP.NET Core 9 Web API (MVC Controllers, JWT Authentication)
- **Database**: SQLite (with Entity Framework Core)
- **Platform**: macOS (Apple Silicon compatible)

## Project Structure

```
584_project/
├── backend/
│   └── CarSalesAPI/          # ASP.NET Core 9 Web API
│       ├── Controllers/       # API Controllers
│       ├── Data/             # DbContext
│       ├── DTOs/             # Data Transfer Objects
│       ├── Models/           # Entity Models
│       └── Services/         # Business Logic Services
└── frontend/                 # Angular 20 SPA
    └── src/
        └── app/
            ├── components/   # Angular Components
            ├── guards/       # Route Guards
            ├── interceptors/ # HTTP Interceptors
            ├── models/       # TypeScript Models
            └── services/     # Angular Services
```

## Features

### Public Features
- Browse all active cars with search and filtering
- View car details
- Pagination support

### User Features (After Login)
- All public features
- View car list and details

### Admin Features
- Full CRUD operations on cars
- Soft delete (deactivate) cars
- View all cars (including inactive)

## Prerequisites

- **.NET 9 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/9.0)
- **Node.js 20+** and **npm** - [Download](https://nodejs.org/)
- **Angular CLI 20** - Install via `npm install -g @angular/cli@20`

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend/CarSalesAPI
```

### 2. Restore Dependencies

```bash
dotnet restore
```

### 3. Database Setup

The database will be automatically created and seeded on first run. The SQLite database file (`carsales.db`) will be created in the project directory. Sample cars and a default admin user will be added automatically.

### 4. Default Admin User

On first run, a default admin user is automatically created:

- **Email**: `admin@carsales.com`
- **Password**: `Admin123!`

⚠️ **Important**: Change this password immediately in production!

You can also create additional admin users by:
1. Registering a user through the API or frontend
2. Manually updating the database to set the role to "Admin":

```bash
# Using sqlite3 (if installed)
sqlite3 carsales.db
UPDATE Users SET Role = 'Admin' WHERE Email = 'your-email@example.com';
```

Or use a database tool like DB Browser for SQLite.

### 5. Run the API

```bash
dotnet run
```

The API will be available at:
- **HTTP**: http://localhost:5000
- **HTTPS**: https://localhost:5001
- **Swagger UI**: http://localhost:5000/swagger

### 6. Configuration

Edit `appsettings.json` to configure:

- **Connection String**: Database file path
- **JWT Secret**: Change the secret key for production
- **JWT Issuer/Audience**: JWT token settings

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=carsales.db"
  },
  "Jwt": {
    "Secret": "YourSuperSecretKeyThatShouldBeAtLeast32CharactersLong!ChangeThisInProduction",
    "Issuer": "CarSalesAPI",
    "Audience": "CarSalesAPI"
  }
}
```

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Update API URL (if needed)

If your backend runs on a different port, update the API URL in the service files:

- `src/app/services/auth.service.ts`
- `src/app/services/cars.service.ts`
- `src/app/services/admin-cars.service.ts`

Change `http://localhost:5000` to your backend URL.

### 4. Run the Frontend

```bash
ng serve
```

Or:

```bash
npm start
```

The application will be available at **http://localhost:4200**

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Public Car Endpoints

- `GET /api/cars` - Get paginated list of active cars
  - Query parameters: `search`, `make`, `minYear`, `maxYear`, `minPrice`, `maxPrice`, `page`, `pageSize`
- `GET /api/cars/{id}` - Get car details by ID

### Admin Car Endpoints (Requires Admin Role)

- `GET /api/admin/cars` - Get all cars (including inactive)
- `GET /api/admin/cars/{id}` - Get car by ID
- `POST /api/admin/cars` - Create a new car
- `PUT /api/admin/cars/{id}` - Update a car
- `DELETE /api/admin/cars/{id}` - Soft delete (deactivate) a car

## Frontend Routes

- `/` - Car list (public)
- `/cars/:id` - Car detail page (public)
- `/login` - Login page
- `/register` - Registration page
- `/admin/cars` - Admin car list (requires Admin role)
- `/admin/cars/new` - Create new car (requires Admin role)
- `/admin/cars/:id/edit` - Edit car (requires Admin role)

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. Register or login to receive a JWT token
2. The token is stored in localStorage
3. The HTTP interceptor automatically adds the token to API requests
4. Protected routes are guarded by `AuthGuard` and `AdminGuard`

## Database Schema

### User Table
- `Id` (int, PK)
- `Email` (string, unique)
- `PasswordHash` (string)
- `Role` (string) - "User" or "Admin"
- `CreatedAt` (datetime)

### Car Table
- `Id` (int, PK)
- `Make` (string)
- `Model` (string)
- `Year` (int)
- `Price` (decimal)
- `Mileage` (int)
- `Description` (string)
- `CreatedAt` (datetime)
- `UpdatedAt` (datetime)
- `IsActive` (bool) - Soft delete flag

## Development Notes

### Backend
- Uses Entity Framework Core with SQLite
- Password hashing with BCrypt
- JWT authentication with role-based authorization
- CORS enabled for Angular dev server (http://localhost:4200)
- Swagger/OpenAPI documentation available

### Frontend
- Standalone Angular components (no NgModules)
- Reactive forms for all user input
- HTTP interceptor for JWT token injection
- Route guards for authentication and authorization
- Responsive, clean UI

## Troubleshooting

### Backend Issues

1. **Database not created**: Ensure you have write permissions in the project directory
2. **Port already in use**: Change the port in `Properties/launchSettings.json`
3. **JWT errors**: Verify the JWT secret in `appsettings.json` is at least 32 characters

### Frontend Issues

1. **CORS errors**: Ensure backend CORS is configured for `http://localhost:4200`
2. **API connection errors**: Verify backend is running and URL is correct
3. **Build errors**: Run `npm install` again and check Node.js version (20+)

## Production Deployment

### Backend
1. Change JWT secret to a secure random string
2. Use environment variables for sensitive configuration
3. Consider using PostgreSQL instead of SQLite for production
4. Enable HTTPS
5. Configure proper CORS origins

### Frontend
1. Build for production: `ng build --configuration production`
2. Serve the `dist/car-sales-frontend` folder with a web server
3. Update API URLs to production backend
4. Configure environment variables for different environments

## License

This project is for educational purposes.

