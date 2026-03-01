using backend_put_together.Application.Storage.DTOs;

namespace backend_put_together.Application.Storage.Queries;

public interface IStoredFileQueryService
{
    public Task<List<LessonFileRequest>> GetFilesByLessonAsync(
        Guid lessonId,
        CancellationToken ct = default);
}