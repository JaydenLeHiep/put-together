namespace backend_put_together.Modules.Video;

public interface IVideoProvider
{
    Task<UploadVideoResult> UploadAsync(
        VideoUploadRequest request,
        CancellationToken ct = default);

    Task DeleteAsync(
        string videoLibraryId,
        string videoGuid,
        CancellationToken ct = default);
}