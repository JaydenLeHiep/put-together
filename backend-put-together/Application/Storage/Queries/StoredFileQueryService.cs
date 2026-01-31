using backend_put_together.Application.Storage.DTOs;
using backend_put_together.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend_put_together.Application.Storage.Queries;

public class StoredFileQueryService : IStoredFileQueryService
{
    private readonly AppDbContext _db;
    
    public StoredFileQueryService(AppDbContext db)
    {
        _db = db;
    }
    
    public async Task<List<LessonFileRequest>> GetFilesByLessonAsync(Guid lessonId, CancellationToken ct = default)
    {
        return await _db.S3StoredFiles
            .Where(f => f.LessonId == lessonId && f.DeletedAt != null)
            .OrderBy(f => f.CreatedAt)
            .Select(f => new LessonFileRequest(lessonId, f.FileName))
            .ToListAsync(ct);
    }
}