using backend_put_together.Application.Courses.DTOs;

namespace backend_put_together.Application.Access.Services;

public interface IAccessService
{
    Task GrantCourseAccessAsync(Guid studentId, Guid courseId, CancellationToken ct = default);
    Task RevokeCourseAccessAsync(Guid studentId, Guid courseId, CancellationToken ct = default);

    Task<bool> HasCourseAccessAsync(Guid studentId, Guid courseId, CancellationToken ct = default);
    Task<bool> HasLessonAccessAsync(Guid studentId, Guid lessonId, CancellationToken ct = default);
    Task<List<CourseReadDto>> GetStudentCourseAccessAsync(Guid studentId, CancellationToken ct = default);
}