namespace backend_put_together.Infrastructure.Video;

public sealed class VideoUploadRequest
{
    public string LibraryId { get; init; } = null!;

    public string StreamApiKey { get; init; } = null!;  

    public string FileName { get; init; } = null!;

    public Stream Stream { get; init; } = null!;

    public string? CollectionId { get; init; }
}