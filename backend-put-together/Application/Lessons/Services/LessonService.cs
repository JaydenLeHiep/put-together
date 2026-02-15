using backend_put_together.Application.Lessons.DTOs;
using backend_put_together.Application.Storage.Services;
using backend_put_together.Application.Video;
using backend_put_together.Domain.Lessons;
using backend_put_together.Infrastructure.Data;
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

        if (request.Files?[0].ContentType == "video/mp4")
        {
            var ctx = await _resolver.ResolveForCourseAsync(
                request.CourseId,
                ct);

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
        }

        var lesson = new Lesson
        {
            Title = request.Title,
            Content = request.Content ?? string.Empty,
            CourseId = request.CourseId,
            VideoLibraryId = videoLibraryId,
            VideoGuid = videoGuid,
            BunnyCollectionId = bunnyCollectionId,
            IsPublished = false,
            CreatedById = userId,
            CreatedAt = DateTime.UtcNow
        };
        
        _db.Lessons.Add(lesson);
        await _db.SaveChangesAsync(ct);
        
        var listOfDocument = new List<IFormFile>();
        
        if (request.Files != null)
        {
            foreach (var file in request.Files)

                if (file.ContentType == "application/pdf")
                {
                    listOfDocument.Add(file);
                }
        }
        await _storedFileService.CreateFileStorageAsync(listOfDocument, lesson.Id, ct);
    }

    // =====================================================
    // UPDATE
    // =====================================================
    public async Task UpdateAsync(
        Guid id,
        UpdateLessonRequest request,
        Guid actorId,
        CancellationToken ct = default)
    {
        var lesson = await _db.Lessons
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, ct);

        if (lesson is null)
            throw new KeyNotFoundException();

        if (lesson.CreatedById != actorId)
            throw new InvalidOperationException();

        if (request.Title is not null)
            lesson.Title = request.Title;

        if (request.Content is not null)
            lesson.Content = request.Content;

        lesson.Touch();

        // ================= VIDEO REPLACEMENT =================
        if (request.File is not null && request.File.Length > 0)
        {
            await using var tx = await _db.Database.BeginTransactionAsync(ct);

            var ctx = await _resolver.ResolveForLessonAsync(id, ct);

            await using var stream = request.File.OpenReadStream();

            var upload = await _video.UploadAsync(
                new VideoUploadRequest
                {
                    LibraryId = ctx.LibraryId,
                    StreamApiKey = ctx.StreamApiKey,
                    FileName = request.File.FileName,
                    Stream = stream,
                    CollectionId = ctx.CollectionId
                },
                ct);

            var oldLibraryId = lesson.VideoLibraryId;
            var oldGuid = lesson.VideoGuid;

            lesson.VideoLibraryId = upload.LibraryId;
            lesson.VideoGuid = upload.VideoGuid;
            lesson.Touch();

            await _db.SaveChangesAsync(ct);
            await tx.CommitAsync(ct);

            // best effort cleanup
            if (!string.IsNullOrWhiteSpace(oldLibraryId)
                && !string.IsNullOrWhiteSpace(oldGuid))
            {
                try
                {
                    await _video.DeleteAsync(
                        oldLibraryId,
                        ctx.StreamApiKey,
                        oldGuid,
                        ct);
                }
                catch (Exception ex)
                {
                    Console.Error.WriteLine(
                        $"[WARN] Delete old video failed: {ex.Message}");
                }
            }

            return;
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
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, ct);

        if (lesson is null)
            throw new KeyNotFoundException();

        if (lesson.CreatedById != actorId)
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
            .FirstOrDefaultAsync(x => x.Id == id && x.IsDeleted, ct);

        if (lesson is null)
            throw new KeyNotFoundException();

        lesson.Restore();
        lesson.Touch();

        await _db.SaveChangesAsync(ct);
    }

    public async Task PublishAsync(Guid lessonId, Guid actorId, CancellationToken ct = default)
    {
        var lesson = await _db.Lessons
            .FirstOrDefaultAsync(x => x.Id == lessonId && !x.IsDeleted, ct);

        if (lesson is null) throw new KeyNotFoundException();

        lesson.Publish(actorId);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UnpublishAsync(Guid lessonId, Guid actorId, CancellationToken ct = default)
    {
        var lesson = await _db.Lessons
            .FirstOrDefaultAsync(x => x.Id == lessonId && !x.IsDeleted, ct);

        if (lesson is null) throw new KeyNotFoundException();

        lesson.Unpublish(actorId);
        await _db.SaveChangesAsync(ct);
    }
}