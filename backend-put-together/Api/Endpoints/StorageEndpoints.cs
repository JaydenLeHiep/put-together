using backend_put_together.Application.Storage.Queries;
using backend_put_together.Application.Storage.Services;
using Carter;
using Microsoft.AspNetCore.Mvc;

namespace backend_put_together.Api.Endpoints;

public class StorageEndpoints : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/storages");
        
        group.MapPost("/", async (
                [FromQuery] Guid lessonId,
                [FromForm] IFormFileCollection files,
                IStoredFileService service,
                CancellationToken ct,
                ILogger<StorageEndpoints> logger) =>
            {
                try
                {
                    if (files.Count == 0)
                    {
                        return Results.BadRequest("No files provided!");
                    }

                    if (lessonId == Guid.Empty)
                    {
                        return Results.BadRequest("LessonId is required!");
                    }

                    await service.CreateFileStorageAsync(files.ToList(), lessonId, ct);
                    return Results.Created();
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Unhandled exception during user registration!");
                    return Results.BadRequest("Something went wrong with uploading files. Please, try again!");
                }
            })
            .Accepts<IFormFileCollection>("multipart/form-data")
            .DisableAntiforgery();
        
        group.MapGet("/lessons/{lessonId:guid}/files", async (
            Guid lessonId,
            IStoredFileQueryService service,
            CancellationToken ct,
            ILogger<StorageEndpoints> logger) =>
        {
            try
            {
                var files = await service.GetFilesByLessonAsync(lessonId, ct);
                return Results.Ok(files);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Unhandled exception during get files!");
                return Results.BadRequest("Something went wrong with getting files! Please , try again!");
            }
        });
        
        group.MapGet("/lessons/{lessonId:guid}/files/{fileId:guid}/download", async (
            Guid lessonId,
            Guid fileId,
            IStoredFileService service,
            CancellationToken ct,
            ILogger<StorageEndpoints> logger) =>
        {
            try
            {
                var url = await service.GetDownloadUrlAsync(lessonId, fileId, ct);
                return Results.Ok(new { url });
            }
            catch (Exception e)
            {
                logger.LogError(e, "Unhandled exception during download file!");
                return Results.BadRequest("Something went wrong during download file! Please, try again!");
            }
        });
    }
}