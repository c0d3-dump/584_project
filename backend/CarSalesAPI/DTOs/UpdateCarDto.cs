using System.ComponentModel.DataAnnotations;

namespace CarSalesAPI.DTOs;

public class UpdateCarDto
{
    [Required]
    [MaxLength(100)]
    public string Make { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Model { get; set; } = string.Empty;

    [Required]
    [Range(1900, 2100)]
    public int Year { get; set; }

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int Mileage { get; set; }

    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;
}

