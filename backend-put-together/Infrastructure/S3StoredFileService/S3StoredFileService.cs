using Amazon.S3;
using Amazon.S3.Model;
using backend_put_together.Domain.Storage;

namespace backend_put_together.Infrastructure.S3StoredFileService;

public class S3StoredFileService : IS3StoredFileService
{
    private readonly IAmazonS3 _s3Client;
    private readonly string? _bucketName;
    
    public S3StoredFileService(IAmazonS3 s3Client, IConfiguration config)
    {
        _s3Client = s3Client;
        _bucketName = config["AWS:BucketName"];
    }
    
    public async Task<S3StoredFileResponse> UploadFileAsync(IFormFile file, S3StoredFileRequest storedFileRequest)
    {
        if (string.IsNullOrWhiteSpace(_bucketName))
            throw new InvalidOperationException("AWS bucket name not configured.");

        var s3Key = S3KeyBuilder.Build(storedFileRequest.LessonId, storedFileRequest.StoredFileId, file.FileName);

        var put = new PutObjectRequest
        {
            BucketName = _bucketName,
            Key = s3Key,
            InputStream = file.OpenReadStream(),
            ContentType = file.ContentType,
        };

        await _s3Client.PutObjectAsync(put);

        var presign = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = s3Key,
            Expires = DateTime.UtcNow.AddHours(1)
        };

        var url = _s3Client.GetPreSignedURL(presign); // <-- standard

        return new S3StoredFileResponse(file.FileName, url);
    }

    public async Task<List<S3StoredFileResponse>> GetFilesAsync()
    {
        var request = new ListObjectsV2Request
        {
            BucketName = _bucketName
        };

        var response = await _s3Client.ListObjectsV2Async(request);
        var s3Objects = new List<S3StoredFileResponse>();

        foreach (var s3Object in response.S3Objects)
        {
            var urlRequest = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = s3Object.Key,
                Expires = DateTime.UtcNow.AddHours(1)
            };

            s3Objects.Add(new S3StoredFileResponse(s3Object.Key, await _s3Client.GetPreSignedURLAsync(urlRequest)));
        }

        return s3Objects;
    }

    public async Task<Stream> DownloadFileAsync(S3DownloadFileRequest s3DownloadFileRequest)
    {
        var key= S3KeyBuilder.Build(s3DownloadFileRequest.LessonId, s3DownloadFileRequest.StoredFileId, s3DownloadFileRequest.FileName);
        
        var request = new GetObjectRequest
        {
            BucketName = _bucketName,
            Key = key
        };

        var response = await _s3Client.GetObjectAsync(request);
        return response.ResponseStream;
    }

    public async Task DeleteFileAsync(S3DeleteFileRequest s3DeleteFileRequest)
    {
        var key = S3KeyBuilder.Build(s3DeleteFileRequest.LessonId, s3DeleteFileRequest.StoredFileId, s3DeleteFileRequest.FileName);
        var request = new DeleteObjectRequest
        {
            BucketName = _bucketName,
            Key = key
        };

        await _s3Client.DeleteObjectAsync(request);
    }
    
    public string GenerateDownloadUrl(string s3Key)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = s3Key,
            Verb = HttpVerb.GET,
            Expires = DateTime.UtcNow.AddMinutes(10),
        };

        return _s3Client.GetPreSignedURL(request);
    }
}