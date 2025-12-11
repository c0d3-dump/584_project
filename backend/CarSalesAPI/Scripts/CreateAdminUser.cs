// This is a helper script to create an admin user
// Run this using: dotnet script Scripts/CreateAdminUser.cs
// Or use it as a reference to create admin users programmatically

using System;
using BCrypt.Net;

namespace CarSalesAPI.Scripts;

public class CreateAdminUser
{
    public static void Main(string[] args)
    {
        if (args.Length < 2)
        {
            Console.WriteLine("Usage: CreateAdminUser <email> <password>");
            return;
        }

        var email = args[0];
        var password = args[1];
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

        Console.WriteLine($"Email: {email}");
        Console.WriteLine($"Password Hash: {passwordHash}");
        Console.WriteLine("\nSQL to run in database:");
        Console.WriteLine($"INSERT INTO Users (Email, PasswordHash, Role, CreatedAt) VALUES ('{email}', '{passwordHash}', 'Admin', datetime('now'));");
        Console.WriteLine("\nOr update existing user:");
        Console.WriteLine($"UPDATE Users SET Role = 'Admin', PasswordHash = '{passwordHash}' WHERE Email = '{email}';");
    }
}

