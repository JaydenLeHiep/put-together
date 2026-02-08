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

    public async Task<IReadOnlyList<LessonReadDto>> GetAllAsync(
        CancellationToken ct = default)
    {
        return await _db.Lessons
            .AsNoTracking()
            .Where(x => !x.IsDeleted)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new LessonReadDto(
                x.Id,
                x.Title,
                x.Content,
                x.VideoLibraryId ?? string.Empty,
                x.VideoGuid ?? string.Empty,
                x.VideoGuid != null ? $"https://iframe.mediadelivery.net/embed/{x.VideoLibraryId}/{x.VideoGuid}" : string.Empty,
                x.CourseId,
                x.IsPublished,
                x.CreatedById,
                x.CreatedAt,
                x.PublishedAt
            ))
            .ToListAsync(ct);
    }

    public async Task<LessonReadDto?> GetByIdAsync(
        Guid id,
        CancellationToken ct = default)
    {
        return await _db.Lessons
            .AsNoTracking()
            .Where(x => x.Id == id && !x.IsDeleted)
            .Select(x => new LessonReadDto(
                x.Id,
                x.Title,
                x.Content,
                x.VideoLibraryId ?? string.Empty,
                x.VideoGuid ?? string.Empty,
                x.VideoGuid != null ? $"https://iframe.mediadelivery.net/embed/{x.VideoLibraryId}/{x.VideoGuid}" : string.Empty,
                x.CourseId,
                x.IsPublished,
                x.CreatedById,
                x.CreatedAt,
                x.PublishedAt
            ))
            .FirstOrDefaultAsync(ct);
    }
    
    public async Task<IReadOnlyList<LessonReadDto>> GetDraftsAsync(
        CancellationToken ct = default)
    {
        return await _db.Lessons
            .AsNoTracking()
            .Where(x => !x.IsDeleted && !x.IsPublished)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new LessonReadDto(
                x.Id,
                x.Title,
                x.Content,
                x.VideoLibraryId ?? string.Empty,
                x.VideoGuid ?? string.Empty,
                x.VideoGuid != null ? $"https://iframe.mediadelivery.net/embed/{x.VideoLibraryId}/{x.VideoGuid}" : string.Empty,
                x.CourseId,
                x.IsPublished,      // false
                x.CreatedById,
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
                !x.IsDeleted &&
                x.IsPublished &&
                // Fix: Check if student has access to the parent Course
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
                x.VideoGuid != null ? $"https://iframe.mediadelivery.net/embed/{x.VideoLibraryId}/{x.VideoGuid}" : string.Empty,
                x.CourseId,
                x.IsPublished,
                x.CreatedById,
                x.CreatedAt,
                x.PublishedAt
            ))
            .ToListAsync(ct);
    }
    
    public async Task<IReadOnlyList<LessonReadDto>> GetPublishedAsync(
        CancellationToken ct = default)
    {
        return await _db.Lessons
            .AsNoTracking()
            .Where(x =>
                !x.IsDeleted &&
                x.IsPublished &&
                x.PublishedAt != null)
            .OrderByDescending(x => x.PublishedAt)
            .Select(x => new LessonReadDto(
                x.Id,
                x.Title,
                x.Content,
                x.VideoLibraryId ?? string.Empty,
                x.VideoGuid ?? string.Empty, 
                x.VideoGuid != null ? $"https://iframe.mediadelivery.net/embed/{x.VideoLibraryId}/{x.VideoGuid}" : string.Empty,
                x.CourseId,
                x.IsPublished,
                x.CreatedById,
                x.CreatedAt,
                x.PublishedAt
            ))
            .ToListAsync(ct);
    }
}