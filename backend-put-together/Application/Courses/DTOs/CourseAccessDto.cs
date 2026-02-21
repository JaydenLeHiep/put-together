namespace backend_put_together.Application.Courses.DTOs;

public record CourseAccessDto(
    Guid CourseId,
    string Title,
    DateTime ExpiresAtUtc
);