using Microsoft.EntityFrameworkCore;

namespace CarSalesAPI.Data;

public static class EmailNormalizer
{
    /// <summary>
    /// Normalizes all existing user emails to lowercase
    /// Run this once to fix existing data
    /// </summary>
    public static void NormalizeExistingEmails(ApplicationDbContext context)
    {
        var users = context.Users.ToList();
        bool hasChanges = false;

        foreach (var user in users)
        {
            var normalizedEmail = user.Email.Trim().ToLowerInvariant();
            if (user.Email != normalizedEmail)
            {
                user.Email = normalizedEmail;
                hasChanges = true;
            }
        }

        if (hasChanges)
        {
            context.SaveChanges();
        }
    }
}

