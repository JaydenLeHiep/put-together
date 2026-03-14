using backend_put_together.Application.Lessons.DTOs;
using backend_put_together.Application.Storage.Services;
using backend_put_together.Application.Video;
using backend_put_together.Domain.Lessons;
using backend_put_together.Domain.Storage;
using backend_put_together.Infrastructure.Data;
using backend_put_together.Infrastructure.S3StoredFileService;
using backend_put_together.Infrastructure.Video;
using Microsoft.EntityFrameworkCore;

namespace backend_put_together.Application.Lessons.Services;

public sealed class LessonService : ILessonService
{
    private readonly AppDbContext _db;
    private readonly IVideoProvider _video;
    private readonly IVideoContextResolver _resolver;
    private readonly IStoredFileService _storedFileService;

    public LessonService(
        AppDbContext db,
        IVideoProvider video,
        IVideoContextResolver resolver,
        IStoredFileService storedFileService
    )
    {
        _db = db;
        _video = video;
        _resolver = resolver;
        _storedFileService = storedFileService;
    }

    // =====================================================
    // CREATE
    // =====================================================
    public async Task CreateAsync(
        CreateLessonRequest request,
        Guid userId,
        string bunnyCollectionId,
        CancellationToken ct = default)
    {
        string? videoLibraryId = null;
        string? videoGuid = null;
        string? thumbnailUrl = null;
        
        if (request.Files?[0].ContentType == "video/mp4")
        {
            var ctx = await _resolver.ResolveForCourseAsync(request.CourseId, ct);

            await using var stream = request.Files[0].OpenReadStream();

            var upload = await _video.UploadAsync(
                new VideoUploadRequest
                {
                    LibraryId = ctx.LibraryId,
                    StreamApiKey = ctx.StreamApiKey,
                    FileName = request.Files[0].FileName,
                    Stream = stream,
                    CollectionId = ctx.CollectionId
                },
                ct);

            videoLibraryId = upload.LibraryId;
            videoGuid = upload.VideoGuid;
            thumbnailUrl = upload.ThumbnailUrl;
        }
        
        var lesson = new Lesson
        {
            Title = request.Title,
            Content = request.Content ?? string.Empty,
            CourseId = request.CourseId,
            VideoLibraryId = videoLibraryId,
            VideoGuid = videoGuid,
            ThumbnailUrl = thumbnailUrl,
            BunnyCollectionId = bunnyCollectionId,
            IsPublished = false,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _db.Lessons.Add(lesson);
        await _db.SaveChangesAsync(ct);

        var listOfDocument = new List<IFormFile>();

        if (request.Files != null)
        {
            foreach (var file in request.Files)
            {
                if (file.ContentType == "application/pdf")
                {
                    listOfDocument.Add(file);
                }
            }
        }

        await _storedFileService.CreateFileStorageAsync(listOfDocument, lesson.Id, ct);
    }

    // =====================================================
    // UPDATE
    // =====================================================
    public async Task UpdateAsync(
             Guid lessonId,
             UpdateLessonRequest request,
             CancellationToken ct = default)
         {
             var lesson = await _db.Lessons
                 .FirstOrDefaultAsync(x => x.Id == lessonId && x.DeletedAt == null, ct);
     
             if (lesson is null)
                 throw new KeyNotFoundException();
     
             if (request.Title is not null)
                 lesson.Title = request.Title;
     
             if (request.Content is not null)
                 lesson.Content = request.Content;
     
             lesson.UpdatedAt = DateTime.UtcNow;
             
             if (request.DeleteFileIds is not null && request.DeleteFileIds.Count > 0)
             {
                 foreach (var fileId in request.DeleteFileIds)
                 {
                     await _storedFileService.DeleteFileAsync(
                         lessonId,
                         fileId,
                         ct);
                 }
             }
             
             if (request.Files is not null && request.Files.Count > 0)
             {
                 await _storedFileService.CreateFileStorageAsync(
                     request.Files.ToList(),
                     lessonId,
                     ct);
             }
     
             await _db.SaveChangesAsync(ct);
         }

    // =====================================================
    // DELETE
    // =====================================================
    public async Task DeleteAsync(
        Guid id,
        Guid actorId,
        CancellationToken ct = default)
    {
        var lesson = await _db.Lessons
            .FirstOrDefaultAsync(x => x.Id == id && x.DeletedAt == null, ct);

        if (lesson is null)
            throw new KeyNotFoundException();

        if (lesson.UserId != actorId)
            throw new InvalidOperationException();

        if (!string.IsNullOrWhiteSpace(lesson.VideoLibraryId)
            && !string.IsNullOrWhiteSpace(lesson.VideoGuid))
        {
            var ctx = await _resolver.ResolveForLessonAsync(id, ct);

            await _video.DeleteAsync(
                lesson.VideoLibraryId,
                ctx.StreamApiKey,
                lesson.VideoGuid,
                ct);
        }

        lesson.SoftDelete();
        await _db.SaveChangesAsync(ct);
    }

    // =====================================================
    // RESTORE / PUBLISH
    // =====================================================
    public async Task RestoreAsync(Guid id, CancellationToken ct = default)
    {
        var lesson = await _db.Lessons
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(x => x.Id == id && x.DeletedAt != null, ct);

        if (lesson is null)
            throw new KeyNotFoundException();

        lesson.Restore();
        lesson.Touch();

        await _db.SaveChangesAsync(ct);
    }

    public async Task PublishAsync(Guid lessonId, Guid actorId, CancellationToken ct = default)
    {
        var lesson = await _db.Lessons
            .FirstOrDefaultAsync(x => x.Id == lessonId && x.DeletedAt == null, ct);

        if (lesson is null)
            throw new KeyNotFoundException();

        lesson.Publish(actorId);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UnpublishAsync(Guid lessonId, Guid actorId, CancellationToken ct = default)
    {
        var lesson = await _db.Lessons
            .FirstOrDefaultAsync(x => x.Id == lessonId && x.DeletedAt == null, ct);

        if (lesson is null)
            throw new KeyNotFoundException();

        lesson.Unpublish(actorId);
        await _db.SaveChangesAsync(ct);
    }
}