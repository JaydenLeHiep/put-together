using backend_put_together.Application.Lessons.DTOs;

namespace backend_put_together.Application.Lessons.Queries;

public interface ILessonCommentQueryService
{
    Task<IReadOnlyList<LessonCommentReadDto>> GetByLessonIdAsync(
        Guid lessonId,
        CancellationToken ct = default
    );
}