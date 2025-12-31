using backend_put_together.Application.Lessons.DTOs;
using backend_put_together.Data;
using backend_put_together.Domain.Lessons;
using backend_put_together.Modules.Video;
using Microsoft.EntityFrameworkCore;

namespace backend_put_together.Application.Lessons.Services;

public sealed class LessonService : ILessonService
{
    private readonly AppDbContext _db;
    private readonly IVideoProvider _video;

    public LessonService(AppDbContext db, IVideoProvider video)
    {
        _db = db;
        _video = video;
    }

    // =====================================================
    // CREATE
    // =====================================================
    public async Task<CreateLessonResponse> CreateAsync(
        CreateLessonRequest request,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            throw new ArgumentException("Title is required.", nameof(request.Title));

        if (request.File is null || request.File.Length == 0)
            throw new ArgumentException("Video file is required.", nameof(request.File));

        await using var stream = request.File.OpenReadStream();

        var upload = await _video.UploadAsync(
            new VideoUploadRequest(
                stream,
                request.File.FileName,
                request.VideoLibraryId),
            ct);

        var lesson = new Lesson
        {
            Title = request.Title,
            Content = request.Content ?? string.Empty,
            VideoLibraryId = upload.LibraryId,
            VideoGuid = upload.VideoGuid,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        };

        _db.Lessons.Add(lesson);
        await _db.SaveChangesAsync(ct);

        return new CreateLessonResponse(
            lesson.Id,
            lesson.Title,
            lesson.Content,
            upload.PlaybackUrl
        );
    }

    // =====================================================
    // UPDATE (with optional video replacement)
    // =====================================================
    public async Task UpdateAsync(
        Guid id,
        UpdateLessonRequest request,
        CancellationToken ct = default)
    {
        var lesson = await _db.Lessons
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, ct);

        if (lesson is null)
            throw new KeyNotFoundException($"Lesson '{id}' not found.");

        // =====================================================
        // PARTIAL UPDATE (fields optional)
        // =====================================================
        if (request.Title is not null)
            lesson.Title = request.Title;

        if (request.Content is not null)
            lesson.Content = request.Content;

        // mark entity as updated
        lesson.Touch();

        // =====================================================
        // OPTIONAL VIDEO REPLACEMENT
        // =====================================================
        if (request.File is not null && request.File.Length > 0)
        {
            // NOTE:
            // If DB commit succeeds but Bunny delete fails,
            // orphan cleanup job will handle it later.

            await using var tx = await _db.Database.BeginTransactionAsync(ct);

            // 1) Upload NEW video
            await using var stream = request.File.OpenReadStream();

            var upload = await _video.UploadAsync(
                new VideoUploadRequest(
                    stream,
                    request.File.FileName,
                    string.IsNullOrWhiteSpace(request.VideoLibraryId)
                        ? lesson.VideoLibraryId
                        : request.VideoLibraryId),
                ct);

            // Backup old refs
            var oldLibraryId = lesson.VideoLibraryId;
            var oldVideoGuid = lesson.VideoGuid;

            // 2) Update DB refs
            lesson.VideoLibraryId = upload.LibraryId;
            lesson.VideoGuid = upload.VideoGuid;

            // mark update again because video changed
            lesson.Touch();

            await _db.SaveChangesAsync(ct);

            // 3) Commit DB (source of truth)
            await tx.CommitAsync(ct);

            // 4) Best-effort delete old video
            try
            {
                await _video.DeleteAsync(oldLibraryId, oldVideoGuid, ct);
            }
            catch (Exception ex)
            {
                // DO NOT throw
                Console.Error.WriteLine(
                    $"[WARN] Failed to delete old video {oldVideoGuid}: {ex.Message}");
            }

            return;
        }

        // =====================================================
        // NO VIDEO CHANGE
        // =====================================================
        await _db.SaveChangesAsync(ct);
    }

    // =====================================================
    // DELETE (SOFT DELETE + Bunny delete)
    // =====================================================
    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var lesson = await _db.Lessons
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, ct);

        if (lesson is null)
            throw new KeyNotFoundException($"Lesson '{id}' not found.");

        // Strong consistency: delete video first
        await _video.DeleteAsync(
            lesson.VideoLibraryId,
            lesson.VideoGuid,
            ct);

        // Soft delete
        lesson.SoftDelete();

        await _db.SaveChangesAsync(ct);
    }

    // =====================================================
    // RESTORE
    // =====================================================
    public async Task RestoreAsync(Guid id, CancellationToken ct = default)
    {
        var lesson = await _db.Lessons
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(x => x.Id == id && x.IsDeleted, ct);

        if (lesson is null)
            throw new KeyNotFoundException($"Lesson '{id}' not found or not deleted.");

        lesson.Restore();
        lesson.Touch();

        await _db.SaveChangesAsync(ct);
    }
}