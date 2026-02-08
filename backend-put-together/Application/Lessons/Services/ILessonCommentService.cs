using backend_put_together.Application.Lessons.DTOs;

namespace backend_put_together.Application.Lessons.Services;

public interface ILessonCommentService
{
    Task AddAsync(
        Guid lessonId,
        Guid authorId,
        CreateLessonCommentRequest request,
        CancellationToken ct = default
    );
}