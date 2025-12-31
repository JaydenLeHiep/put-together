using backend_put_together.Data;
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
            .Where(x => !x.IsDeleted) // explicit business rule
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new LessonReadDto(
                x.Id,
                x.Title,
                x.Content,
                x.VideoLibraryId,
                x.VideoGuid,
                $"https://iframe.mediadelivery.net/embed/{x.VideoLibraryId}/{x.VideoGuid}",
                x.CreatedAt
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
                x.VideoLibraryId,
                x.VideoGuid,
                $"https://iframe.mediadelivery.net/embed/{x.VideoLibraryId}/{x.VideoGuid}",
                x.CreatedAt
            ))
            .FirstOrDefaultAsync(ct);
    }
}