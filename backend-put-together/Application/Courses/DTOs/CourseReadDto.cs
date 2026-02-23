namespace backend_put_together.Application.Courses.DTOs;

public sealed record CourseReadDto(
    Guid Id,
    Guid CategoryId, 
    string Title,
    string Description,
    string Level,
    string BunnyCollectionId,
    decimal? Price,
    int LessonCount,
    DateTime CreatedAt
);