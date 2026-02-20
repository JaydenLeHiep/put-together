using backend_put_together.Application.Courses.DTOs;

namespace backend_put_together.Application.Courses.Queries;

public interface ICourseQueryService
{
    Task<IReadOnlyList<CourseReadDto>> GetAllAsync(CancellationToken ct = default);
    Task<IReadOnlyList<CourseReadDto>> GetPublishedAsync(CancellationToken ct = default);
    Task<CourseReadDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    public Task<CourseWithLessonsDto?> GetCourseWithLessonsAsync(Guid courseId, CancellationToken ct = default);
    public Task<List<CourseStudentReadDto>> GetPaidCoursesByStudentIdAsync(Guid studentId,
        CancellationToken ct = default);
    
}