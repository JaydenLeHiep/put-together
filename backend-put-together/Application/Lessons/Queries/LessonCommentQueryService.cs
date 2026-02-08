using backend_put_together.Application.Lessons.DTOs;
using backend_put_together.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend_put_together.Application.Lessons.Queries;

public sealed class LessonCommentQueryService : ILessonCommentQueryService
{
    private readonly AppDbContext _db;

    public LessonCommentQueryService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<LessonCommentReadDto>> GetByLessonIdAsync(
        Guid lessonId,
        CancellationToken ct = default)
    {
        return await _db.LessonComments
            .AsNoTracking()
            .Where(c => c.LessonId == lessonId)
            .OrderBy(c => c.CreatedAt)
            .Join(
                _db.Users,
                c => c.AuthorId,
                u => u.Id,
                (c, u) => new LessonCommentReadDto(
                    c.Id,
                    c.LessonId,
                    c.AuthorId,
                    u.UserName,           
                    c.Content,
                    c.CreatedAt
                )
            )
            .ToListAsync(ct);
    }
}