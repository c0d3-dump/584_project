using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CarSalesAPI.Data;
using CarSalesAPI.DTOs;
using CarSalesAPI.Models;

namespace CarSalesAPI.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto)
    {
        // Normalize email to lowercase for case-insensitive comparison
        var normalizedEmail = registerDto.Email.Trim().ToLowerInvariant();
        
        // Check if email exists (case-insensitive) - load all and filter in memory for SQLite compatibility
        var allUsers = await _context.Users.ToListAsync();
        var existingUser = allUsers.FirstOrDefault(u => 
            u.Email.Trim().ToLowerInvariant() == normalizedEmail);
        
        if (existingUser != null)
        {
            return null; // Email already exists
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password.Trim());

        var user = new User
        {
            Email = normalizedEmail,
            PasswordHash = passwordHash,
            Role = "User",
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(user);
        return new AuthResponseDto
        {
            Token = token,
            Email = user.Email,
            Role = user.Role
        };
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
    {
        // Normalize email to lowercase for case-insensitive comparison
        var normalizedEmail = loginDto.Email.Trim().ToLowerInvariant();
        
        // Find user (case-insensitive email comparison) - load all and filter for SQLite compatibility
        var allUsers = await _context.Users.ToListAsync();
        var user = allUsers.FirstOrDefault(u => 
            u.Email.Trim().ToLowerInvariant() == normalizedEmail);
        
        if (user == null)
        {
            return null; // User not found
        }

        // Verify password - handle potential BCrypt verification issues
        try
        {
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password.Trim(), user.PasswordHash);
            if (!isPasswordValid)
            {
                return null; // Invalid password
            }
        }
        catch
        {
            // If password hash is corrupted or invalid format
            return null;
        }

        var token = GenerateJwtToken(user);
        return new AuthResponseDto
        {
            Token = token,
            Email = user.Email,
            Role = user.Role
        };
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSecret = _configuration["Jwt:Secret"] 
            ?? "YourSuperSecretKeyThatShouldBeAtLeast32CharactersLong!";
        var jwtIssuer = _configuration["Jwt:Issuer"] ?? "CarSalesAPI";
        var jwtAudience = _configuration["Jwt:Audience"] ?? "CarSalesAPI";

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

