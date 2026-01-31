namespace backend_put_together.Domain.Storage;

public record S3StoredFileRequest(Guid LessonId, Guid StoredFileId);