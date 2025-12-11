using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarSalesAPI.Data;
using CarSalesAPI.DTOs;
using CarSalesAPI.Models;

namespace CarSalesAPI.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize(Roles = "Admin")]
public class CarsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CarsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<CarDto>>> GetAllCars()
    {
        var cars = await _context.Cars
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new CarDto
            {
                Id = c.Id,
                Make = c.Make,
                Model = c.Model,
                Year = c.Year,
                Price = c.Price,
                Mileage = c.Mileage,
                Description = c.Description,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt,
                IsActive = c.IsActive
            })
            .ToListAsync();

        return Ok(cars);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CarDto>> GetCar(int id)
    {
        var car = await _context.Cars
            .Where(c => c.Id == id)
            .Select(c => new CarDto
            {
                Id = c.Id,
                Make = c.Make,
                Model = c.Model,
                Year = c.Year,
                Price = c.Price,
                Mileage = c.Mileage,
                Description = c.Description,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt,
                IsActive = c.IsActive
            })
            .FirstOrDefaultAsync();

        if (car == null)
        {
            return NotFound();
        }

        return Ok(car);
    }

    [HttpPost]
    public async Task<ActionResult<CarDto>> CreateCar([FromBody] CreateCarDto createCarDto)
    {
        var car = new Car
        {
            Make = createCarDto.Make,
            Model = createCarDto.Model,
            Year = createCarDto.Year,
            Price = createCarDto.Price,
            Mileage = createCarDto.Mileage,
            Description = createCarDto.Description,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.Cars.Add(car);
        await _context.SaveChangesAsync();

        var carDto = new CarDto
        {
            Id = car.Id,
            Make = car.Make,
            Model = car.Model,
            Year = car.Year,
            Price = car.Price,
            Mileage = car.Mileage,
            Description = car.Description,
            CreatedAt = car.CreatedAt,
            UpdatedAt = car.UpdatedAt,
            IsActive = car.IsActive
        };

        return CreatedAtAction(nameof(GetCar), new { id = car.Id }, carDto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<CarDto>> UpdateCar(int id, [FromBody] UpdateCarDto updateCarDto)
    {
        var car = await _context.Cars.FindAsync(id);
        if (car == null)
        {
            return NotFound();
        }

        car.Make = updateCarDto.Make;
        car.Model = updateCarDto.Model;
        car.Year = updateCarDto.Year;
        car.Price = updateCarDto.Price;
        car.Mileage = updateCarDto.Mileage;
        car.Description = updateCarDto.Description;
        car.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var carDto = new CarDto
        {
            Id = car.Id,
            Make = car.Make,
            Model = car.Model,
            Year = car.Year,
            Price = car.Price,
            Mileage = car.Mileage,
            Description = car.Description,
            CreatedAt = car.CreatedAt,
            UpdatedAt = car.UpdatedAt,
            IsActive = car.IsActive
        };

        return Ok(carDto);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCar(int id)
    {
        var car = await _context.Cars.FindAsync(id);
        if (car == null)
        {
            return NotFound();
        }

        // Soft delete
        car.IsActive = false;
        car.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

