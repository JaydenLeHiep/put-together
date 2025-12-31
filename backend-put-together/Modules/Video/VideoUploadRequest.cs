namespace backend_put_together.Modules.Video;

public sealed record VideoUploadRequest(
    Stream Stream,
    string FileName,
    string? LibraryId = null
);