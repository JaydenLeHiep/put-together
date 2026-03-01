namespace backend_put_together.Infrastructure.S3StoredFileService;

public static class S3KeyBuilder
{
    public static string Build(Guid lessonId, Guid fileId, string fileName)
        => $"lesson/{lessonId}/files/{fileId}-{fileName}";
}