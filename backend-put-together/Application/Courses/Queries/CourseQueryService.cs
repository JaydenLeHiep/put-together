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

    public async Task<List<CategoryWithCoursesDto>>
        GetPaidCoursesByStudentIdAsync(
            Guid studentId,
            CancellationToken ct = default)
    {
        var flatData =
            await (from sca in _db.StudentCourseAccess.AsNoTracking()
                    join c in _db.Courses.AsNoTracking()
                        on sca.CourseId equals c.Id
                    join cat in _db.Categories.AsNoTracking()
                        on c.CategoryId equals cat.Id
                    where sca.StudentId == studentId
                          && sca.RevokedAtUtc == null
                          && sca.ExpiresAtUtc > DateTime.UtcNow
                    select new
                    {
                        CategoryId = cat.Id,
                        CategoryName = cat.Name,
                        CourseId = c.Id,
                        CourseTitle = c.Title,
                        sca.ExpiresAtUtc
                    })
                .ToListAsync(ct);
        
        var result = flatData
            .GroupBy(x => new { x.CategoryId, x.CategoryName })
            .Select(group => new CategoryWithCoursesDto(
                group.Key.CategoryId,
                group.Key.CategoryName,
                group
                    .OrderBy(x => x.CourseTitle)
                    .Select(course => new CourseAccessDto(
                        course.CourseId,
                        course.CourseTitle,
                        course.ExpiresAtUtc
                    ))
                    .ToList()
            ))
            .OrderBy(x => x.CategoryName)
            .ToList();

        return result;
    }
}