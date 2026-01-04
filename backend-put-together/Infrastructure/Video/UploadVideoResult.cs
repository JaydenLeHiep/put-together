namespace backend_put_together.Infrastructure.Video;

public sealed record UploadVideoResult(
    string LibraryId,
    string VideoGuid,
    string PlaybackUrl
);