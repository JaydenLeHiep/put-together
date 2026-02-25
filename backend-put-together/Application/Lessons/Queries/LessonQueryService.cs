using backend_put_together.Infrastructure.Data;
using backend_put_together.Application.Lessons.DTOs;
using Microsoft.EntityFrameworkCore;

namespace backend_put_together.Application.Lessons.Queries;

public sealed class LessonQueryService : ILessonQueryService
{
    private readonly AppDbContext _db;

    public LessonQueryService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<LessonReadDto>> GetAllAsync(CancellationToken ct = default)
    {
        return await _db.Lessons
            .AsNoTracking()
            .Where(x => x.DeletedAt == null)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new LessonReadDto(
                x.Id,
                x.Title,
                x.Content,
                x.VideoLibraryId ?? string.Empty,
                x.VideoGuid ?? string.Empty,
                x.VideoGuid != null
                    ? $"https://iframe.mediadelivery.net/embed/{x.VideoLibraryId}/{x.VideoGuid}"
                    : string.Empty,
                x.CourseId,
                x.IsPublished,
                x.UserId,
                x.CreatedAt,
                x.PublishedAt
            ))
            .ToListAsync(ct);
    }

    public async Task<LessonReadDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _db.Lessons
            .AsNoTracking()
            .Where(x => x.Id == id && x.DeletedAt == null)
            .Select(x => new LessonReadDto(
                x.Id,
                x.Title,
                x.Content,
                x.VideoLibraryId ?? string.Empty,
                x.VideoGuid ?? string.Empty,
                x.VideoGuid != null
                    ? $"https://iframe.mediadelivery.net/embed/{x.VideoLibraryId}/{x.VideoGuid}"
                    : string.Empty,
                x.CourseId,
                x.IsPublished,
                x.UserId,
                x.CreatedAt,
                x.PublishedAt
            ))
            .FirstOrDefaultAsync(ct);
    }

    public async Task<IReadOnlyList<LessonReadDto>> GetDraftsAsync(CancellationToken ct = default)
    {
        return await _db.Lessons
            .AsNoTracking()
            .Where(x => x.DeletedAt == null && !x.IsPublished)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new LessonReadDto(
                x.Id,
                x.Title,
                x.Content,
                x.VideoLibraryId ?? string.Empty,
                x.VideoGuid ?? string.Empty,
                x.VideoGuid != null
                    ? $"https://iframe.mediadelivery.net/embed/{x.VideoLibraryId}/{x.VideoGuid}"
                    : string.Empty,
                x.CourseId,
                x.IsPublished, // false
                x.UserId,
                x.CreatedAt,
                null
            ))
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<LessonReadDto>> GetAccessibleLessonsForStudentAsync(
        Guid studentId,
        CancellationToken ct = default)
    {
        return await _db.Lessons
            .AsNoTracking()
            .Where(x =>
                x.DeletedAt == null &&
                x.IsPublished &&
                _db.StudentCourseAccess.Any(a =>
                    a.StudentId == studentId &&
                    a.CourseId == x.CourseId))
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new LessonReadDto(
                x.Id,
                x.Title,
                x.Content,
                x.VideoLibraryId ?? string.Empty,
                x.VideoGuid ?? string.Empty,
                x.VideoGuid != null
                    ? $"https://iframe.mediadelivery.net/embed/{x.VideoLibraryId}/{x.VideoGuid}"
                    : string.Empty,
                x.CourseId,
                x.IsPublished,
                x.UserId,
                x.CreatedAt,
                x.PublishedAt
            ))
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<LessonReadDto>> GetPublishedAsync(CancellationToken ct = default)
    {
        return await _db.Lessons
            .AsNoTracking()
            .Where(x =>
                x.DeletedAt == null &&
                x.IsPublished &&
                x.PublishedAt != null)
            .OrderByDescending(x => x.PublishedAt)
            .Select(x => new LessonReadDto(
                x.Id,
                x.Title,
                x.Content,
                x.VideoLibraryId ?? string.Empty,
                x.VideoGuid ?? string.Empty,
                x.VideoGuid != null
                    ? $"https://iframe.mediadelivery.net/embed/{x.VideoLibraryId}/{x.VideoGuid}"
                    : string.Empty,
                x.CourseId,
                x.IsPublished,
                x.UserId,
                x.CreatedAt,
                x.PublishedAt
            ))
            .ToListAsync(ct);
    }

    public async Task<List<LessonStudentReadDto>> GetLessonsByCourseIdAsync(
        Guid courseId,
        CancellationToken ct = default)
    {
        var lessons = await _db.Lessons
            .AsNoTracking()
            .Where(l => l.CourseId == courseId)
            .Where(l => l.DeletedAt == null)          
            .Where(l => l.IsPublished)
            .OrderBy(l => l.CreatedAt)
            .Select(l => new LessonStudentReadDto(
                l.Id,
                l.Title,
                l.Content,
                l.VideoLibraryId,
                l.VideoGuid,
                l.StoredFiles
                    .Where(f => f.DeletedAt == null)
                    .Select(f => new FileDocumentDto(
                        f.Id,
                        f.FileName
                    ))
                    .ToList()
            ))
            .ToListAsync(ct);

        return lessons;
    }
}