namespace backend_put_together.Application.Storage.Services;

public interface IStoredFileService
{
    Task CreateFileStorageAsync(List<IFormFile> files,
        Guid lessonId,
        CancellationToken ct = default);

    public Task<string> GetDownloadUrlAsync(
        Guid lessonId,
        Guid fileId,
        CancellationToken ct = default);
}