using backend_put_together.Application.Lessons.DTOs;

namespace backend_put_together.Application.Lessons.Services;

public interface ILessonService
{
    Task<CreateLessonResponse> CreateAsync(
        CreateLessonRequest request,
        CancellationToken ct = default);

    Task UpdateAsync(Guid id, UpdateLessonRequest request, CancellationToken ct);
    Task DeleteAsync(Guid id, CancellationToken ct);
    Task RestoreAsync(Guid id, CancellationToken ct);
}