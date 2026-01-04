namespace backend_put_together.Infrastructure.Video;

public sealed record VideoUploadRequest(
    Stream Stream,
    string FileName,
    string? LibraryId = null
);