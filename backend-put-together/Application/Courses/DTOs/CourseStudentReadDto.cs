namespace backend_put_together.Application.Courses.DTOs;

public record CourseStudentReadDto(Guid CourseId, DateTime PurchasedAtUtc, DateTime ExpiresAtUtc );
    