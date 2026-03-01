using backend_put_together.Application.Lessons.DTOs;

namespace backend_put_together.Application.Lessons.Services;

public interface ILessonService
{
    Task CreateAsync(
        CreateLessonRequest request, 
        Guid userId,
        string bunnyCollectionId,
        CancellationToken ct = default);

    Task UpdateAsync(Guid id, UpdateLessonRequest request, Guid actorId, CancellationToken ct);
    Task DeleteAsync(Guid id,  Guid actorId, CancellationToken ct);
    Task RestoreAsync(Guid id, CancellationToken ct);
    Task PublishAsync(Guid lessonId, Guid actorId, CancellationToken ct = default);
    Task UnpublishAsync(Guid lessonId, Guid actorId, CancellationToken ct = default);
}