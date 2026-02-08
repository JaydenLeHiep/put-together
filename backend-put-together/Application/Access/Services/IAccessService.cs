namespace backend_put_together.Application.Access.Services;

public interface IAccessService
{
    // Grant access to entire course (and all its lessons)
    Task GrantCourseAccessAsync(Guid studentId, Guid courseId, Guid adminId, CancellationToken ct = default);
    // Revoke access
    Task RevokeCourseAccessAsync(Guid studentId, Guid courseId, CancellationToken ct = default);
    // Check access
    Task<bool> HasLessonAccessAsync(Guid studentId, Guid lessonId, CancellationToken ct = default);
    Task<bool> HasCourseAccessAsync(Guid studentId, Guid courseId, CancellationToken ct = default);
}