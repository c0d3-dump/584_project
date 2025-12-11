using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarSalesAPI.Data;
using CarSalesAPI.DTOs;

namespace CarSalesAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CarsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CarsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<CarDto>>> GetCars(
        [FromQuery] string? search = null,
        [FromQuery] string? make = null,
        [FromQuery] int? minYear = null,
        [FromQuery] int? maxYear = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _context.Cars.Where(c => c.IsActive).AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(c => 
                c.Make.Contains(search) || 
                c.Model.Contains(search) ||
                c.Description.Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(make))
        {
            query = query.Where(c => c.Make == make);
        }

        if (minYear.HasValue)
        {
            query = query.Where(c => c.Year >= minYear.Value);
        }

        if (maxYear.HasValue)
        {
            query = query.Where(c => c.Year <= maxYear.Value);
        }

        if (minPrice.HasValue)
        {
            query = query.Where(c => c.Price >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(c => c.Price <= maxPrice.Value);
        }

        var totalCount = await query.CountAsync();
        var cars = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
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

        return Ok(new PagedResult<CarDto>
        {
            Items = cars,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CarDto>> GetCar(int id)
    {
        var car = await _context.Cars
            .Where(c => c.Id == id && c.IsActive)
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
}

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

