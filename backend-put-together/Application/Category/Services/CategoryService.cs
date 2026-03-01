using backend_put_together.Application.Category.DTOs;
using backend_put_together.Infrastructure.Data;
using backend_put_together.Infrastructure.Video.Bunny;
using Microsoft.EntityFrameworkCore;
using DomainCategory = backend_put_together.Domain.Category.Category;

namespace backend_put_together.Application.Category.Services;

public sealed class CategoryService : ICategoryService
{
    private readonly AppDbContext _db;
    private readonly BunnyLibraryClient _bunny;

    public CategoryService(
        AppDbContext db,
        BunnyLibraryClient bunny)
    {
        _db = db;
        _bunny = bunny;
    }

    public async Task<Guid> CreateAsync(CreateCategoryRequestDto req, CancellationToken ct)
    {
        var exists = await _db.Categories
            .AnyAsync(c => c.Name == req.Name, ct);

        if (exists)
            throw new InvalidOperationException("Category name already exists.");

        // Create Bunny Library
        var library = await _bunny.CreateLibraryAsync(req.Name, ct);

        // Persist category
        var category = new DomainCategory
        {
            Name = req.Name,
            Description = req.Description ?? string.Empty,
            BunnyLibraryId = library.Id.ToString(),
            BunnyStreamApiKey = library.ApiKey,
            BunnyReadOnlyApiKey = library.ReadOnlyApiKey,
            CreatedAt = DateTime.UtcNow
        };

        _db.Categories.Add(category);
        await _db.SaveChangesAsync(ct);

        return category.Id;
    }
    
    public async Task UpdateAsync(
        Guid categoryId,
        UpdateCategoryRequestDto req,
        CancellationToken ct)
    {
        var category = await _db.Categories
            .FirstOrDefaultAsync(c => c.Id == categoryId, ct);

        if (category is null)
            throw new InvalidOperationException("Category not found.");

        // Name uniqueness check (ignore self)
        var nameExists = await _db.Categories
            .AnyAsync(c => c.Name == req.Name && c.Id != categoryId, ct);

        if (nameExists)
            throw new InvalidOperationException("Category name already exists.");

        // Update Bunny library FIRST
        if (!string.Equals(category.Name, req.Name, StringComparison.Ordinal))
        {
            await _bunny.UpdateLibraryNameAsync(
                category.BunnyLibraryId,
                req.Name,
                ct
            );
        }

        // Update DB
        category.Name = req.Name;
        category.Description = req.Description ?? category.Description;

        await _db.SaveChangesAsync(ct);
    }
    
    public async Task DeleteAsync(Guid categoryId, CancellationToken ct)
    {
        // Block if courses exist
        var hasCourses = await _db.Courses
            .AnyAsync(c => c.CategoryId == categoryId, ct);

        if (hasCourses)
            throw new InvalidOperationException(
                "Cannot delete category that contains courses."
            );

        // Load category
        var category = await _db.Categories
            .FirstOrDefaultAsync(c => c.Id == categoryId, ct);

        if (category is null)
            throw new InvalidOperationException("Category not found.");

        // Delete Bunny Video Library FIRST
        await _bunny.DeleteLibraryAsync(category.BunnyLibraryId, ct);

        // Delete category locally
        _db.Categories.Remove(category);
        await _db.SaveChangesAsync(ct);
    }
}