namespace backend_put_together.Application.Lessons.DTOs;

public sealed record LessonReadDto(
    Guid Id,
    string Title,
    string Content,
    string VideoLibraryId,
    string VideoGuid,
    string VideoUrl,
    DateTime CreatedAt
);