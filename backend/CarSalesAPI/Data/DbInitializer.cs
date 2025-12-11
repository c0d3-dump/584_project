using CarSalesAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CarSalesAPI.Data;

public static class DbInitializer
{
    public static void Initialize(ApplicationDbContext context)
    {
        // Ensure database is created
        context.Database.EnsureCreated();

        // Normalize existing user emails to lowercase (for existing data)
        EmailNormalizer.NormalizeExistingEmails(context);

        // Check if admin user exists
        if (!context.Users.Any(u => u.Role == "Admin"))
        {
            // Create default admin user
            // Password: Admin123! (change this in production)
            var adminPasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!");
            
            var adminUser = new User
            {
                Email = "admin@carsales.com",
                PasswordHash = adminPasswordHash,
                Role = "Admin",
                CreatedAt = DateTime.UtcNow
            };

            context.Users.Add(adminUser);
            context.SaveChanges();

            Console.WriteLine("Default admin user created:");
            Console.WriteLine("Email: admin@carsales.com");
            Console.WriteLine("Password: Admin123!");
            Console.WriteLine("⚠️  Please change this password in production!");
        }

        // Seed sample cars if none exist
        if (!context.Cars.Any())
        {
            var sampleCars = new[]
            {
                new Car
                {
                    Make = "Toyota",
                    Model = "Camry",
                    Year = 2015,
                    Price = 12000,
                    Mileage = 85000,
                    Description = "Well-maintained Toyota Camry with regular service history. Great fuel economy and reliable.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsActive = true
                },
                new Car
                {
                    Make = "Honda",
                    Model = "Civic",
                    Year = 2018,
                    Price = 15000,
                    Mileage = 45000,
                    Description = "Low mileage Honda Civic in excellent condition. One owner, garage kept.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsActive = true
                },
                new Car
                {
                    Make = "Ford",
                    Model = "F-150",
                    Year = 2016,
                    Price = 25000,
                    Mileage = 95000,
                    Description = "Powerful Ford F-150 truck. Perfect for work or recreation. Towing package included.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsActive = true
                }
            };

            context.Cars.AddRange(sampleCars);
            context.SaveChanges();
        }
    }
}

