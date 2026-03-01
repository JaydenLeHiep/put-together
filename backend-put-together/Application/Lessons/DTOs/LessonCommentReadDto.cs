namespace backend_put_together.Application.Lessons.DTOs;

public sealed record LessonCommentReadDto(
    Guid Id,
    Guid LessonId,
    Guid AuthorId,
    string AuthorName,
    string Content,
    DateTime CreatedAt
);