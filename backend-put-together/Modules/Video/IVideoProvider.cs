namespace backend_put_together.Modules.Video;

public interface IVideoProvider
{
    Task<UploadVideoResult> UploadAsync(
        Stream fileStream,
        string fileName,
        string? libraryId = null,
        CancellationToken cancellationToken = default
    );
}