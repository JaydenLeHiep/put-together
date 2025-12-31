namespace backend_put_together.Application.Lessons.DTOs;

public sealed record CreateLessonResponse(
    Guid Id,
    string Title,
    string Content,
    string VideoUrl
);