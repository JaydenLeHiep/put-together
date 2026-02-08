using backend_put_together.Application.Category.DTOs;
using backend_put_together.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend_put_together.Application.Category.Queries;

public class CategoryQueryService : ICategoryQueryService
{
    private readonly AppDbContext _db;

    public CategoryQueryService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<CategoryReadDto>> GetAllAsync(CancellationToken ct)
    {
        return await _db.Categories
            .OrderBy(c => c.Name)
            .Select(c => new CategoryReadDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                BunnyLibraryId = c.BunnyLibraryId,
                CreatedAt = c.CreatedAt,
                CourseCount = c.Courses.Count
            })
            .ToListAsync(ct);
    }

    public async Task<CategoryReadDto?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        return await _db.Categories
            .Where(c => c.Id == id)
            .Select(c => new CategoryReadDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                BunnyLibraryId = c.BunnyLibraryId,
                CreatedAt = c.CreatedAt,
                CourseCount = c.Courses.Count
            })
            .FirstOrDefaultAsync(ct);
    }
}