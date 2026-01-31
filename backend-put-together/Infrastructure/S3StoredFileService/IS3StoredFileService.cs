using backend_put_together.Domain.Storage;

namespace backend_put_together.Infrastructure.S3StoredFileService;

public interface IS3StoredFileService
{
    Task<S3StoredFileResponse> UploadFileAsync(IFormFile file, S3StoredFileRequest storedFileRequest);
    Task<List<S3StoredFileResponse>> GetFilesAsync();
    Task<Stream> DownloadFileAsync(S3DownloadFileRequest request);
    Task DeleteFileAsync(S3DeleteFileRequest request);
    public string GenerateDownloadUrl(string s3Key);
}