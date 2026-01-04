using backend_put_together.Application.Lessons.DTOs;
using backend_put_together.Application.Lessons.Services;
using backend_put_together.Application.Lessons.Queries;
using Carter;
using Microsoft.AspNetCore.Mvc;

namespace backend_put_together.Api.Endpoints.Lessons;

public sealed class LessonEndpoints : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/lessons");

        // =========================================================
        // GET /api/lessons
        // =========================================================
        group.MapGet("", async (ILessonQueryService query) =>
        {
            var lessons = await query.GetAllAsync();
            return Results.Ok(lessons);
        });

        // =========================================================
        // GET /api/lessons/{id}
        // =========================================================
        group.MapGet("{id:guid}", async (
            Guid id,
            ILessonQueryService query) =>
        {
            var lesson = await query.GetByIdAsync(id);
            return lesson is null
                ? Results.NotFound()
                : Results.Ok(lesson);
        });

        // =========================================================
        // POST /api/lessons
        // =========================================================
        group.MapPost("", async (
                [FromForm] CreateLessonRequest req,
                ILessonService service,
                CancellationToken ct) =>
        {
            if (string.IsNullOrWhiteSpace(req.Title))
                return Results.BadRequest("title is required");

            if (req.File is null || req.File.Length == 0)
                return Results.BadRequest("file is required");

            var result = await service.CreateAsync(req, ct);
            return Results.Ok(result);
        })
        .Accepts<CreateLessonRequest>("multipart/form-data")
        .DisableAntiforgery();

        // =========================================================
        // PUT /api/lessons/{id}
        // Update metadata + optional video replacement
        // =========================================================
        group.MapPut("{id:guid}", async (
                Guid id,
                [FromForm] UpdateLessonRequest req,
                ILessonService service,
                CancellationToken ct) =>
        {
            try
            {
                await service.UpdateAsync(id, req, ct);
                return Results.NoContent();
            }
            catch (KeyNotFoundException)
            {
                return Results.NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return Results.Problem(
                    title: "Video provider update failed",
                    detail: ex.Message,
                    statusCode: StatusCodes.Status502BadGateway);
            }
        })
        .Accepts<UpdateLessonRequest>("multipart/form-data")
        .DisableAntiforgery();

        // =========================================================
        // DELETE /api/lessons/{id}
        // Soft delete + Bunny delete
        // =========================================================
        group.MapDelete("{id:guid}", async (
                Guid id,
                ILessonService service,
                CancellationToken ct) =>
        {
            try
            {
                await service.DeleteAsync(id, ct);
                return Results.NoContent();
            }
            catch (KeyNotFoundException)
            {
                return Results.NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return Results.Problem(
                    title: "Video provider delete failed",
                    detail: ex.Message,
                    statusCode: StatusCodes.Status502BadGateway);
            }
        });

        // =========================================================
        // POST /api/lessons/{id}/restore
        // =========================================================
        group.MapPost("{id:guid}/restore", async (
                Guid id,
                ILessonService service,
                CancellationToken ct) =>
        {
            try
            {
                await service.RestoreAsync(id, ct);
                return Results.NoContent();
            }
            catch (KeyNotFoundException)
            {
                return Results.NotFound();
            }
        });
    }
}