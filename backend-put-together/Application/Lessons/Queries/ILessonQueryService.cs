using backend_put_together.Application.Lessons.DTOs;

namespace backend_put_together.Application.Lessons.Queries;

public interface ILessonQueryService
{
    Task<IReadOnlyList<LessonReadDto>> GetAllAsync(
        CancellationToken ct = default);

    Task<LessonReadDto?> GetByIdAsync(
        Guid id,
        CancellationToken ct = default);
}