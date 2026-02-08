namespace backend_put_together.Domain.Storage;

public record S3DeleteFileRequest(Guid LessonId, Guid StoredFileId, string FileName);