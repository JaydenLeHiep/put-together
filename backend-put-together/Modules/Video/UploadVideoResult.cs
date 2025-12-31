namespace backend_put_together.Modules.Video;

public sealed record UploadVideoResult(
    string LibraryId,
    string VideoGuid,
    string PlaybackUrl
);