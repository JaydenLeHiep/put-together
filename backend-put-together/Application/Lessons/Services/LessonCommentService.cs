using backend_put_together.Application.Lessons.DTOs;
using backend_put_together.Domain.Lessons;
using backend_put_together.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend_put_together.Application.Lessons.Services;

public sealed class LessonCommentService : ILessonCommentService
{
    private readonly AppDbContext _db;

    public LessonCommentService(AppDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(
        Guid lessonId,
        Guid authorId,
        CreateLessonCommentRequest request,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Content))
            throw new ArgumentException("Comment content is required.");

        var lesson = await _db.Lessons
            .FirstOrDefaultAsync(l => l.Id == lessonId && !l.IsDeleted, ct);

        if (lesson is null)
            throw new KeyNotFoundException("Lesson not found.");

        if (lesson.IsPublished)
            throw new InvalidOperationException("Cannot comment on a published lesson.");

        var comment = new LessonComment
        {
            LessonId = lessonId,
            AuthorId = authorId,
            Content = request.Content,
            CreatedAt = DateTime.UtcNow
        };

        _db.LessonComments.Add(comment);
        await _db.SaveChangesAsync(ct);
    }
}