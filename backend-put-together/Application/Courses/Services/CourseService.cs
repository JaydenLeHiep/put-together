using backend_put_together.Application.Courses.DTOs;
using backend_put_together.Domain.Courses;
using backend_put_together.Infrastructure.Data;
using backend_put_together.Infrastructure.Video.Bunny;
using Microsoft.EntityFrameworkCore;

namespace backend_put_together.Application.Courses.Services;

public sealed class CourseService : ICourseService
{
    private readonly AppDbContext _db;
    private readonly BunnyCollectionClient _bunnyCollection;

    public CourseService(
        AppDbContext db,
        BunnyCollectionClient bunnyCollection)
    {
        _db = db;
        _bunnyCollection = bunnyCollection;
    }

    // =====================================================
    // CREATE COURSE
    // =====================================================
    public async Task<Guid> CreateAsync(
        CreateCourseRequest request,
        Guid adminId,
        CancellationToken ct = default)
    {
        // Load Category → Needed for Bunny Library
        var category = await _db.Categories
            .FirstOrDefaultAsync(c => c.Id == request.CategoryId, ct);

        if (category is null)
            throw new KeyNotFoundException("Category not found.");

        // Create Bunny Collection INSIDE Category Library
        var collectionId = await _bunnyCollection.CreateCollectionAsync(
            category.BunnyLibraryId,
            category.BunnyStreamApiKey,
            $"Course_{request.Level}_{request.Title}",
            ct);

        // Create Course
        var course = new Course
        {
            Title = request.Title,
            Description = request.Description,
            Level = request.Level,
            CategoryId = request.CategoryId, 
            BunnyCollectionId = collectionId,
            Price = request.Price,
            IsPublished = false,
            CreatedById = adminId,
            CreatedAt = DateTime.UtcNow
        };

        _db.Courses.Add(course);
        await _db.SaveChangesAsync(ct);

        return course.Id;
    }

    // =====================================================
    // UPDATE COURSE
    // =====================================================
    public async Task UpdateAsync(
        Guid id,
        UpdateCourseRequest request,
        CancellationToken ct = default)
    {
        var course = await _db.Courses
            .FirstOrDefaultAsync(x => x.Id == id, ct);

        if (course is null)
            throw new KeyNotFoundException($"Course '{id}' not found.");

        if (request.Title is not null) course.Title = request.Title;
        if (request.Description is not null) course.Description = request.Description;
        if (request.Level is not null) course.Level = request.Level;
        if (request.Price.HasValue) course.Price = request.Price;
        if (request.IsPublished.HasValue) course.IsPublished = request.IsPublished.Value;

        course.Touch();
        await _db.SaveChangesAsync(ct);
    }

    // =====================================================
    // DELETE COURSE
    // =====================================================
    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var course = await _db.Courses
            .Include(c => c.Lessons)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

        if (course is null)
            throw new KeyNotFoundException($"Course '{id}' not found.");

        // Check active lessons
        var activeLessons = course.Lessons.Where(l => !l.IsDeleted).ToList();

        if (activeLessons.Any())
        {
            throw new InvalidOperationException(
                $"Cannot delete course. {activeLessons.Count} active lesson(s) still exist.");
        }

        // Load Category → Needed for Bunny call
        var category = await _db.Categories
            .FirstAsync(c => c.Id == course.CategoryId, ct);

        // Delete Bunny Collection
        try
        {
            await _bunnyCollection.DeleteCollectionAsync(
                category.BunnyLibraryId,
                category.BunnyStreamApiKey,
                course.BunnyCollectionId,
                ct);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine(
                $"[WARN] Bunny collection delete failed: {ex.Message}");
        }

        // Soft delete
        course.SoftDelete();
        await _db.SaveChangesAsync(ct);
    }

    // =====================================================
    // PUBLISH
    // =====================================================
    public async Task PublishAsync(Guid id, CancellationToken ct = default)
    {
        var course = await _db.Courses.FindAsync(new object[] { id }, ct);
        if (course is null) throw new KeyNotFoundException();

        course.IsPublished = true;
        course.Touch();

        await _db.SaveChangesAsync(ct);
    }

    public async Task UnpublishAsync(Guid id, CancellationToken ct = default)
    {
        var course = await _db.Courses.FindAsync(new object[] { id }, ct);
        if (course is null) throw new KeyNotFoundException();

        course.IsPublished = false;
        course.Touch();

        await _db.SaveChangesAsync(ct);
    }
}