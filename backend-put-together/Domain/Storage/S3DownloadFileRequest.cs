namespace backend_put_together.Domain.Storage;

public record S3DownloadFileRequest(Guid LessonId, Guid StoredFileId, string FileName);