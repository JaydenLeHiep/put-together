namespace backend_put_together.Application.Storage.Services;

public interface IStoredFileService
{
    Task CreateAsync(List<IFormFile> files,
        Guid lessonId,
        CancellationToken ct = default);

    public Task<string> GetDownloadUrlAsync(
        Guid lessonId,
        Guid fileId,
        CancellationToken ct = default);
}