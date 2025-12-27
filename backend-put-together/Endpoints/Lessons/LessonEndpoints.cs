using backend_put_together.Data;
using backend_put_together.Domain.Lessons;
using backend_put_together.Modules.Video;
using backend_put_together.Modules.Bunny;
using Carter;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Mvc;

namespace backend_put_together.Endpoints.Lessons;

public class LessonEndpoints : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/lessons");

        // =========================
        // GET /api/lessons
        // =========================
        group.MapGet("", async (AppDbContext db) =>
        {
            var lessons = await db.Lessons
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new
                {
                    x.Id,
                    x.Title,
                    x.Content,
                    x.VideoLibraryId,
                    x.VideoGuid
                })
                .ToListAsync();

            return Results.Ok(lessons);
        });

        // =========================
        // POST /api/lessons
        // multipart/form-data
        // =========================
        group.MapPost("", async (
                [FromForm] CreateLessonRequest req,
                AppDbContext db,
                IVideoProvider videoProvider,
                IOptions<BunnyOptions> bunnyOptions,
                CancellationToken ct) =>
        {
            if (string.IsNullOrWhiteSpace(req.Title))
                return Results.BadRequest("title is required");

            if (req.File is null || req.File.Length == 0)
                return Results.BadRequest("file is required");

            // =========================
            // LibraryId fallback
            // =========================
            var libraryId =
                string.IsNullOrWhiteSpace(req.VideoLibraryId)
                || req.VideoLibraryId == "string"
                    ? bunnyOptions.Value.DefaultLibraryId
                    : req.VideoLibraryId;

            if (string.IsNullOrWhiteSpace(libraryId))
                return Results.BadRequest("Video library id is missing");

            await using var stream = req.File.OpenReadStream();

            var upload = await videoProvider.UploadAsync(
                stream,
                req.File.FileName,
                libraryId,
                ct
            );

            var finalLibraryId = upload.LibraryId ?? libraryId;

            if (string.IsNullOrWhiteSpace(finalLibraryId))
                return Results.BadRequest("Video library id is missing");
            
            var lesson = new Lesson
            {
                Title = req.Title,
                Content = req.Content ?? string.Empty,
                VideoLibraryId = finalLibraryId,
                VideoGuid = upload.VideoGuid
            };

            db.Lessons.Add(lesson);
            await db.SaveChangesAsync(ct);

            return Results.Ok(new
            {
                lesson.Id,
                lesson.Title,
                lesson.Content,
                lesson.VideoLibraryId,
                lesson.VideoGuid,
                videoUrl = upload.PlaybackUrl
            });
        })
        .Accepts<CreateLessonRequest>("multipart/form-data")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .DisableAntiforgery();
    }
}