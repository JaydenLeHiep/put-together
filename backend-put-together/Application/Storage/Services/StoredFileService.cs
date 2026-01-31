using backend_put_together.Domain.Storage;
using backend_put_together.Infrastructure.Data;
using backend_put_together.Infrastructure.S3StoredFileService;
using Microsoft.EntityFrameworkCore;

namespace backend_put_together.Application.Storage.Services;

public class StoredFileService : IStoredFileService
{
    private readonly ILogger<StoredFileService> _logger;
    private readonly IS3StoredFileService _s3StoredFileService;
    private readonly AppDbContext _db;
    
    public StoredFileService(ILogger<StoredFileService> logger, IS3StoredFileService s3StoredFileService, AppDbContext db)
    {
        _logger = logger;
        _s3StoredFileService = s3StoredFileService;
        _db = db;
    }
    
    public async Task CreateAsync(List<IFormFile> files, Guid lessonId, CancellationToken ct = default)
    {
        _logger.LogInformation($"Creating files for {lessonId}");
        var listOfMetadata = new List<S3StoredFile>();
        
        foreach (var file in files)
        {
            Guid storedFileId = Guid.NewGuid();
            var s3StoredFileRequest = new S3StoredFileRequest(lessonId, storedFileId);
            try
            {
                await _s3StoredFileService.UploadFileAsync(file, s3StoredFileRequest);
                
                listOfMetadata.Add(new S3StoredFile
                {
                    Id = storedFileId,
                    FileName = file.FileName,
                    S3Key = S3KeyBuilder.Build(lessonId, storedFileId, file.FileName),
                    LessonId = lessonId,
                    CreatedAt = DateTime.UtcNow,
                });
            }
            catch (Exception e)
            {
                _logger.LogInformation($"Error saving files for {lessonId}: {e.Message} in s3.");
                throw;
            }
        }

        try
        {
            await _db.S3StoredFiles.AddRangeAsync(listOfMetadata, ct);
            await _db.SaveChangesAsync(ct);
        }
        catch (Exception e)
        {
            _logger.LogInformation($"Error creating files for {lessonId}: {e.Message}");
            foreach (var metadata in listOfMetadata)
            {
                var deletingFile = new S3DeleteFileRequest(lessonId, metadata.Id, metadata.FileName);
                await _s3StoredFileService.DeleteFileAsync(deletingFile);
            }
            throw;
        }
    }


    public async Task<string> GetDownloadUrlAsync(Guid lessonId, Guid fileId, CancellationToken ct = default)
    {
        var file = await _db.S3StoredFiles
            .FirstOrDefaultAsync(f =>
                    f.Id == fileId &&
                    f.LessonId == lessonId,
                ct);

        if (file == null)
            throw new KeyNotFoundException("File not found");

        return _s3StoredFileService.GenerateDownloadUrl(
            file.S3Key);
    }
}