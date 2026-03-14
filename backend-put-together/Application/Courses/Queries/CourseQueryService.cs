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
                c.Lessons.Count(l => l.DeletedAt == null),
                c.CreatedAt
            ))
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<CourseReadDto>> GetPublishedAsync(CancellationToken ct = default)
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
                c.Lessons.Count(l => l.DeletedAt == null && l.IsPublished),
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
                c.Lessons.Count(l => l.DeletedAt == null),
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
                c.Lessons
                    .Where(l => l.DeletedAt == null)
                    .Select(l => new LessonReadDto(
                        l.Id,
                        l.Title,
                        l.Content,
                        l.VideoLibraryId ?? string.Empty,
                        l.VideoGuid ?? string.Empty,
                        l.VideoGuid != null
                            ? $"https://iframe.mediadelivery.net/embed/{l.VideoLibraryId}/{l.VideoGuid}"
                            : string.Empty,
                        l.ThumbnailUrl ?? string.Empty,
                        l.CourseId,
                        l.IsPublished,
                        l.UserId,
                        l.CreatedAt,
                        l.PublishedAt
                    ))
                    .ToList()
            ))
            .FirstOrDefaultAsync(ct);

        return course;
    }

    public async Task<List<CategoryWithCoursesDto>> GetPaidCoursesByStudentIdAsync(
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

    public async Task<List<PublicCategoryCatalogDto>> GetPublicCourseCatalogAsync(
        CancellationToken ct = default)
    {
        var categories = await _db.Categories
            .AsNoTracking()
            .OrderBy(c => c.Name)
            .Select(category => new PublicCategoryCatalogDto(
                category.Id,
                category.Name,
                category.Description,
                category.Courses
                    .Where(course =>
                        course.DeletedAt == null &&
                        course.Lessons.Any(lesson =>
                            lesson.DeletedAt == null &&
                            lesson.IsPublished &&
                            lesson.PublishedAt != null))
                    .OrderBy(course => course.Level)
                    .ThenBy(course => course.Title)
                    .Select(course => new PublicCourseCardDto(
                        course.Id,
                        course.Title,
                        course.Description,
                        course.Level,
                        course.Price,
                        course.Lessons.Count(lesson =>
                            lesson.DeletedAt == null &&
                            lesson.IsPublished &&
                            lesson.PublishedAt != null),
                        course.Lessons
                            .Where(lesson =>
                                lesson.DeletedAt == null &&
                                lesson.IsPublished &&
                                lesson.PublishedAt != null &&
                                lesson.ThumbnailUrl != null &&
                                lesson.ThumbnailUrl != "")
                            .OrderBy(lesson => lesson.CreatedAt)
                            .Select(lesson => lesson.ThumbnailUrl)
                            .FirstOrDefault(),
                        course.Lessons
                            .Where(lesson =>
                                lesson.DeletedAt == null &&
                                lesson.IsPublished &&
                                lesson.PublishedAt != null)
                            .OrderBy(lesson => lesson.CreatedAt)
                            .Select(lesson => new PublicLessonPreviewDto(
                                lesson.Id,
                                lesson.Title,
                                lesson.Content,
                                lesson.ThumbnailUrl ?? string.Empty
                            ))
                            .ToList()
                    ))
                    .ToList()
            ))
            .ToListAsync(ct);

        return categories
            .Where(category => category.Courses.Count > 0)
            .ToList();
    }
}