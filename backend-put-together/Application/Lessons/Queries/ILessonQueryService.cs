using backend_put_together.Application.Lessons.DTOs;

namespace backend_put_together.Application.Lessons.Queries;

public interface ILessonQueryService
{
    Task<IReadOnlyList<LessonReadDto>> GetAllAsync(CancellationToken ct = default);

    Task<LessonReadDto?> GetByIdAsync(Guid id, CancellationToken ct = default);

    Task<IReadOnlyList<LessonReadDto>> GetDraftsAsync(CancellationToken ct = default);

    Task<IReadOnlyList<LessonReadDto>> GetAccessibleLessonsForStudentAsync(Guid studentId, CancellationToken ct = default);

    Task<IReadOnlyList<LessonReadDto>> GetPublishedAsync(CancellationToken ct = default);
    Task<List<LessonStudentReadDto>> GetLessonsByCourseIdAsync(Guid courseId, CancellationToken ct = default);
}