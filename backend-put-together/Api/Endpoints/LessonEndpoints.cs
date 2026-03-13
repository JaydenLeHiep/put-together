using System.Security.Claims;
using backend_put_together.Application.Courses.Queries;
using backend_put_together.Application.Lessons.DTOs;
using backend_put_together.Application.Lessons.Queries;
using backend_put_together.Application.Lessons.Services;
using Carter;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_put_together.Api.Endpoints;

public sealed class LessonEndpoints : ICarterModule
{
    // Matches frontend rule: 1 video + 5 documents = max 6 files
    private const int MaxAmountOfFilesForALesson = 6;

    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app
            .MapGroup("/api/lessons")
            .WithTags("Lessons");

        // =========================================================
        // GET /api/lessons
        // Teacher | Admin: get all lessons
        // =========================================================
        group.MapGet("", async (
            ILessonQueryService query,
            CancellationToken ct) =>
        {
            var lessons = await query.GetAllAsync(ct);
            return Results.Ok(lessons);
        })
        .RequireAuthorization(new AuthorizeAttribute
        {
            Roles = "Teacher,Admin"
        });

        // =========================================================
        // GET /api/lessons/{id}
        // Teacher | Admin: get lesson by id
        // =========================================================
        group.MapGet("{id:guid}", async (
            Guid id,
            ILessonQueryService query,
            CancellationToken ct) =>
        {
            var lesson = await query.GetByIdAsync(id, ct);

            return lesson is null
                ? Results.NotFound()
                : Results.Ok(lesson);
        })
        .RequireAuthorization(new AuthorizeAttribute
        {
            Roles = "Teacher,Admin"
        });

        // =========================================================
        // POST /api/lessons
        // Teacher | Admin: create lesson
        // =========================================================
        group.MapPost("", async (
            [FromForm] CreateLessonRequest req,
            ILessonService service,
            ICourseQueryService courseQuery,
            HttpContext httpContext,
            CancellationToken ct,
            ILogger<LessonEndpoints> logger) =>
        {
            if (string.IsNullOrWhiteSpace(req.Title))
                return Results.BadRequest("Title is required.");

            if (req.Files is not null && req.Files.Count > MaxAmountOfFilesForALesson)
                return Results.BadRequest($"Maximum files allowed: {MaxAmountOfFilesForALesson}.");

            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null || !Guid.TryParse(userId, out var actorId))
                return Results.Unauthorized();

            try
            {
                var course = await courseQuery.GetByIdAsync(req.CourseId, ct);
                if (course is null)
                    return Results.BadRequest("Course not found.");

                await service.CreateAsync(req, actorId, course.BunnyCollectionId, ct);
                return Results.Created();
            }
            catch (InvalidOperationException ex)
            {
                logger.LogWarning(ex, "Lesson creation failed due to business/video rule.");
                return Results.BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unexpected error while creating lesson.");
                return Results.Problem(
                    title: "Failed to create lesson",
                    detail: ex.Message,
                    statusCode: StatusCodes.Status500InternalServerError);
            }
        })
        .Accepts<CreateLessonRequest>("multipart/form-data")
        .DisableAntiforgery()
        .RequireAuthorization(new AuthorizeAttribute
        {
            Roles = "Teacher,Admin"
        });

        // =========================================================
        // PUT /api/lessons/{id}
        // Teacher | Admin: update lesson
        // =========================================================
        group.MapPut("{lessonId:guid}", async (
            Guid lessonId,
            [FromForm] UpdateLessonRequest req,
            ILessonService service,
            HttpContext httpContext,
            CancellationToken ct) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null || !Guid.TryParse(userId, out var actorId))
                return Results.Unauthorized();

            try
            {
                await service.UpdateAsync(lessonId, req, ct);
                return Results.NoContent();
            }
            catch (KeyNotFoundException)
            {
                return Results.NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return Results.BadRequest(ex.Message);
            }
        })
        .Accepts<UpdateLessonRequest>("multipart/form-data")
        .DisableAntiforgery()
        .RequireAuthorization(new AuthorizeAttribute
        {
            Roles = "Teacher,Admin"
        });

        // =========================================================
        // DELETE /api/lessons/{id}
        // Teacher | Admin: delete lesson
        // =========================================================
        group.MapDelete("{id:guid}", async (
            Guid id,
            ILessonService service,
            HttpContext httpContext,
            CancellationToken ct) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null || !Guid.TryParse(userId, out var actorId))
                return Results.Unauthorized();

            try
            {
                await service.DeleteAsync(id, actorId, ct);
                return Results.NoContent();
            }
            catch (KeyNotFoundException)
            {
                return Results.NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return Results.BadRequest(ex.Message);
            }
        })
        .RequireAuthorization(new AuthorizeAttribute
        {
            Roles = "Teacher,Admin"
        });

        // =========================================================
        // POST /api/lessons/{id}/restore
        // Admin: restore deleted lesson
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
            catch (InvalidOperationException ex)
            {
                return Results.BadRequest(ex.Message);
            }
        })
        .RequireAuthorization(new AuthorizeAttribute
        {
            Roles = "Admin"
        });

        // =========================================================
        // GET /api/lessons/drafts
        // Teacher | Admin: get draft lessons
        // =========================================================
        group.MapGet("/drafts", async (
            ILessonQueryService query,
            CancellationToken ct) =>
        {
            var lessons = await query.GetDraftsAsync(ct);
            return Results.Ok(lessons);
        })
        .RequireAuthorization(new AuthorizeAttribute
        {
            Roles = "Teacher,Admin"
        });

        // =========================================================
        // POST /api/lessons/{id}/publish
        // Teacher | Admin: publish own lesson
        // =========================================================
        group.MapPost("{id:guid}/publish", async (
            Guid id,
            ILessonService service,
            HttpContext httpContext,
            CancellationToken ct) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null || !Guid.TryParse(userId, out var actorId))
                return Results.Unauthorized();

            try
            {
                await service.PublishAsync(id, actorId, ct);
                return Results.Ok();
            }
            catch (KeyNotFoundException)
            {
                return Results.NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return Results.BadRequest(ex.Message);
            }
        })
        .RequireAuthorization(new AuthorizeAttribute
        {
            Roles = "Teacher,Admin"
        });

        // =========================================================
        // POST /api/lessons/{id}/unpublish
        // Teacher | Admin: unpublish own lesson
        // =========================================================
        group.MapPost("{id:guid}/unpublish", async (
            Guid id,
            ILessonService service,
            HttpContext httpContext,
            CancellationToken ct) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null || !Guid.TryParse(userId, out var actorId))
                return Results.Unauthorized();

            try
            {
                await service.UnpublishAsync(id, actorId, ct);
                return Results.Ok();
            }
            catch (KeyNotFoundException)
            {
                return Results.NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return Results.BadRequest(ex.Message);
            }
        })
        .RequireAuthorization(new AuthorizeAttribute
        {
            Roles = "Teacher,Admin"
        });

        // =========================================================
        // POST /api/lessons/{id}/comments
        // Teacher | Admin: add comment to lesson
        // =========================================================
        group.MapPost("{id:guid}/comments", async (
            Guid id,
            CreateLessonCommentRequest req,
            ILessonCommentService service,
            HttpContext httpContext,
            CancellationToken ct) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null || !Guid.TryParse(userId, out var actorId))
                return Results.Unauthorized();

            try
            {
                await service.AddAsync(id, actorId, req, ct);
                return Results.NoContent();
            }
            catch (KeyNotFoundException)
            {
                return Results.NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return Results.BadRequest(ex.Message);
            }
        })
        .RequireAuthorization(new AuthorizeAttribute
        {
            Roles = "Teacher,Admin"
        });

        // =========================================================
        // GET /api/lessons/{id}/comments
        // Teacher | Admin: get comments by lesson id
        // =========================================================
        group.MapGet("{id:guid}/comments", async (
            Guid id,
            ILessonCommentQueryService query,
            CancellationToken ct) =>
        {
            var comments = await query.GetByLessonIdAsync(id, ct);
            return Results.Ok(comments);
        })
        .RequireAuthorization(new AuthorizeAttribute
        {
            Roles = "Teacher,Admin"
        });

        // =========================================================
        // GET /api/lessons/my-lessons
        // Student: get all lessons accessible to current student
        // =========================================================
        group.MapGet("/my-lessons", async (
            ILessonQueryService query,
            HttpContext httpContext,
            CancellationToken ct) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null || !Guid.TryParse(userId, out var studentId))
                return Results.Unauthorized();

            var lessons = await query.GetAccessibleLessonsForStudentAsync(studentId, ct);
            return Results.Ok(lessons);
        })
        .RequireAuthorization(new AuthorizeAttribute
        {
            Roles = "Student"
        });

        // =========================================================
        // GET /api/lessons/published
        // Teacher | Admin: get published lessons
        // =========================================================
        group.MapGet("/published", async (
            ILessonQueryService query,
            CancellationToken ct) =>
        {
            var lessons = await query.GetPublishedAsync(ct);
            return Results.Ok(lessons);
        })
        .RequireAuthorization(new AuthorizeAttribute
        {
            Roles = "Teacher,Admin"
        });

        // =========================================================
        // GET /api/lessons/{courseId}/course
        // Student: get lessons by course id
        // =========================================================
        group.MapGet("/{courseId:guid}/course", async (
            Guid courseId,
            ILessonQueryService query,
            CancellationToken ct) =>
        {
            var lessons = await query.GetLessonsByCourseIdAsync(courseId, ct);
            return Results.Ok(lessons);
        })
        .RequireAuthorization(new AuthorizeAttribute
        {
            Roles = "Student"
        });
    }
}