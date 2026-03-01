namespace backend_put_together.Infrastructure.Video;

public interface IVideoProvider
{
    Task<UploadVideoResult> UploadAsync(
        VideoUploadRequest request,
        CancellationToken ct = default);

    Task DeleteAsync(
        string videoLibraryId,
        string videoGuid,
        string streamApiKey,
        CancellationToken ct = default);
}