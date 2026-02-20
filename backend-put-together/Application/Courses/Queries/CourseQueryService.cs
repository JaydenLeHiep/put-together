using backend_put_together.Application.Courses.DTOs;
using backend_put_together.Application.Lessons.DTOs;
using backend_put_together.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend_put_together.Application.Courses.Queries;

public sealed class CourseQueryService : ICourseQueryService
{
    private readonly AppDbContext _db;
    
    public CourseQueryService(AppDbContext db)
    {
        _db = db;
    }
    
    public async Task<IReadOnlyList<CourseReadDto>> GetAllAsync(CancellationToken ct = default)
    {
        return await _db.Courses
            .AsNoTracking()
            .Select(c => new CourseReadDto(
                c.Id,
                c.CategoryId,
                c.Title,
                c.Description,
                c.Level,
                c.BunnyCollectionId,
                c.Price,
                c.IsPublished,
                c.Lessons.Count(l => !l.IsDeleted),
                c.CreatedAt
            ))
            .ToListAsync(ct);
    }
    
    public async Task<IReadOnlyList<CourseReadDto>> GetPublishedAsync(CancellationToken ct = default)
    {
        return await _db.Courses
            .AsNoTracking()
            .Where(c => c.IsPublished)
            .Select(c => new CourseReadDto(
                c.Id,
                c.CategoryId,
                c.Title,
                c.Description,
                c.Level,
                c.BunnyCollectionId,
                c.Price,
                c.IsPublished,
                c.Lessons.Count(l => !l.IsDeleted && l.IsPublished),
                c.CreatedAt
            ))
            .ToListAsync(ct);
    }
    
    public async Task<CourseReadDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _db.Courses
            .AsNoTracking()
            .Where(c => c.Id == id)
            .Select(c => new CourseReadDto(
                c.Id,
                c.CategoryId,
                c.Title,
                c.Description,
                c.Level,
                c.BunnyCollectionId,
                c.Price,
                c.IsPublished,
                c.Lessons.Count(l => !l.IsDeleted),
                c.CreatedAt
            ))
            .FirstOrDefaultAsync(ct);
    }
    
    public async Task<CourseWithLessonsDto?> GetCourseWithLessonsAsync(
        Guid courseId, 
        CancellationToken ct = default)
    {
        var course = await _db.Courses
            .AsNoTracking()
            .Where(c => c.Id == courseId)
            .Select(c => new CourseWithLessonsDto(
                c.Id,
                c.CategoryId,
                c.Title,
                c.Description,
                c.Level,
                c.Price,
                c.IsPublished,
                c.Lessons
                    .Where(l => !l.IsDeleted)
                    .Select(l => new LessonReadDto(
                        l.Id,
                        l.Title,
                        l.Content,
                        l.VideoLibraryId ?? string.Empty, 
                        l.VideoGuid ?? string.Empty,      
                        l.VideoGuid != null 
                            ? $"https://iframe.mediadelivery.net/embed/{l.VideoLibraryId}/{l.VideoGuid}" 
                            : string.Empty,              
                        l.CourseId,
                        l.IsPublished,
                        l.CreatedById,
                        l.CreatedAt,
                        l.PublishedAt
                    ))
                    .ToList()
            ))
            .FirstOrDefaultAsync(ct);

        return course;
    }

    public async Task<List<CourseStudentReadDto>> GetPaidCoursesByStudentIdAsync(Guid studentId,
        CancellationToken ct = default)
    {
        var course = await _db.StudentCourseAccess
            .AsNoTracking()
            .Where(c => c.StudentId == studentId)
            .Select(c => new CourseStudentReadDto(c.StudentId, c.PurchasedAtUtc, c.ExpiresAtUtc))
            .ToListAsync(ct);

        return course;
    }
}