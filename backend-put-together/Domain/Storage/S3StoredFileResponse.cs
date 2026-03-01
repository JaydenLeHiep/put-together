namespace backend_put_together.Domain.Storage;

public record S3StoredFileResponse(string FileName, string PreSignedUrl);