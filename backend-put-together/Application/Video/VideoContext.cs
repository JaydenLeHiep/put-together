namespace backend_put_together.Application.Video;

public sealed class VideoContext
{
    public required string LibraryId { get; init; }
    public required string StreamApiKey { get; init; }
    public required string CollectionId { get; init; }
}