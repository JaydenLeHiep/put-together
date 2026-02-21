using System.Security.Claims;
using backend_put_together.Application.Courses.Queries;
using backend_put_together.Application.Lessons.DTOs;
using backend_put_together.Application.Lessons.Services;
using backend_put_together.Application.Lessons.Queries;
using Carter;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_put_together.Api.Endpoints;

public sealed class LessonEndpoints : ICarterModule
{
    // Just to match with rule in frontend (1 video + 5 documents =  max 6)
    private const int MaxAmountOfFilesForALesson = 6;
    
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/lessons");

        // =========================================================
        // GET /api/lessons  (Teacher | Admin)
        // =========================================================
        group.MapGet("", async (ILessonQueryService query) =>
        {
            var lessons = await query.GetAllAsync();
            return Results.Ok(lessons);
        })
        .RequireAuthorization(new AuthorizeAttribute
        {
            Roles = "Teacher,Admin"
        });

        // =========================================================
        // GET /api/lessons/{id}  (Teacher | Admin)
        // =========================================================
        group.MapGet("{id:guid}", async (
            Guid id,
            ILessonQueryService query) =>
        {
            var lesson = await query.GetByIdAsync(id);
            return lesson is null
                ? Results.NotFound()
                : Results.Ok(lesson);
        })
        .RequireAuthorization(new AuthorizeAttribute
        {
            Roles = "Teacher,Admin"
        });

        // =========================================================
        // POST /api/lessons  (Teacher | Admin)
        // =========================================================
        group.MapPost("", async (
                [FromForm] CreateLessonRequest req,
                ILessonService service,
                HttpContext httpContext, 
                ICourseQueryService query,
                CancellationToken ct,
                ILogger<LessonEndpoints> logger) =>
            {
                try
                {
                    if (string.IsNullOrWhiteSpace(req.Title))
                        return Results.BadRequest("title is required");

                    if (req.Files != null && req.Files.Count > MaxAmountOfFilesForALesson)
                    {
                        return Results.BadRequest($"Maximum files to upload are {MaxAmountOfFilesForALesson}");
                    }
                    var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                    if (userId is null) 
                        return Results.Unauthorized();
                    
                    var course = await query.GetByIdAsync(req.CourseId, ct);
                    if (course is null)
                    {
                        return Results.BadRequest("Course not found");
                    }
                    
                    await service.CreateAsync(req, Guid.Parse(userId), course.BunnyCollectionId, ct);
                    return Results.Created();
                }
                catch (Exception e)
                {
                    logger.LogError(e, "Failed to create lesson");
                    return Results.BadRequest("Failed to create lesson");
                }
            })
            .Accepts<CreateLessonRequest>("multipart/form-data")
            .DisableAntiforgery()
            .RequireAuthorization(new AuthorizeAttribute
            {
                Roles = "Teacher,Admin"
            });

        // =========================================================
        // PUT /api/lessons/{id}  (Teacher | Admin)
        // =========================================================
        group.MapPut("{id:guid}", async (
                Guid id,
                [FromForm] UpdateLessonRequest req,
                ILessonService service,
                HttpContext httpContext,
                CancellationToken ct) =>
        {
            var actorId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (actorId is null) return Results.Unauthorized();

            try
            {
                await service.UpdateAsync(id, req, Guid.Parse(actorId), ct);
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
        .DisableAntiforgery()
        .RequireAuthorization(new AuthorizeAttribute
        {
            Roles = "Teacher,Admin"
        });

        // =========================================================
        // DELETE /api/lessons/{id}  (Admin) (Teacher)
        // =========================================================
        group.MapDelete("{id:guid}", async (
                Guid id,
                ILessonService service,
                HttpContext httpContext,
                CancellationToken ct) =>
        {
            var actorId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (actorId is null) return Results.Unauthorized();

            try
            {
                await service.DeleteAsync(id, Guid.Parse(actorId), ct);
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
        })
        .RequireAuthorization(new AuthorizeAttribute
        {
            Roles = "Teacher,Admin"
        });

        // =========================================================
        // POST /api/lessons/{id}/restore  (Admin)
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
        })
        .RequireAuthorization(new AuthorizeAttribute
        {
            Roles = "Admin"
        });
        
        // =========================================================
        // GET /api/lessons/drafts  (Teacher | Admin)
        // Everyone can see all draft lessons (internal feed)
        // =========================================================
        group.MapGet("/drafts", async (ILessonQueryService query) =>
            {
                var lessons = await query.GetDraftsAsync();
                return Results.Ok(lessons);
            })
            .RequireAuthorization(new AuthorizeAttribute
            {
                Roles = "Teacher,Admin"
            });
        
        // =========================================================
        // POST /api/lessons/{id}/publish  (Teacher | Admin)
        // Only the owner can publish their own lesson
        // =========================================================
        group.MapPost("{id:guid}/publish", async (
                Guid id,
                ILessonService service,
                HttpContext httpContext,
                CancellationToken ct) =>
            {
                var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId is null) return Results.Unauthorized();

                await service.PublishAsync(id, Guid.Parse(userId), ct);
                return Results.Ok();
            })
            .RequireAuthorization(new AuthorizeAttribute
            {
                Roles = "Teacher,Admin"
            });
        
        group.MapPost("{id:guid}/unpublish", async (
                Guid id,
                ILessonService service,
                HttpContext httpContext,
                CancellationToken ct) =>
            {
                var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId is null) return Results.Unauthorized();

                await service.UnpublishAsync(id, Guid.Parse(userId), ct);
                return Results.Ok();
            })
            .RequireAuthorization(new AuthorizeAttribute
            {
                Roles = "Teacher,Admin"
            });
        
        // =========================================================
        // POST /api/lessons/{id}/comments  (Teacher | Admin)
        // =========================================================
        group.MapPost("{id:guid}/comments", async (
                Guid id,
                CreateLessonCommentRequest req,
                ILessonCommentService service,
                HttpContext httpContext,
                CancellationToken ct) =>
            {
                var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId is null) return Results.Unauthorized();

                await service.AddAsync(id, Guid.Parse(userId), req, ct);
                return Results.NoContent();
            })
            .RequireAuthorization(new AuthorizeAttribute
            {
                Roles = "Teacher,Admin"
            });


        // =========================================================
        // GET /api/lessons/{id}/comments  (Teacher | Admin)
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
        // GET /api/lessons/my-lessons  (Student)
        // Only lessons granted to the current student
        // =========================================================
        group.MapGet("/my-lessons", async (
                ILessonQueryService query,
                HttpContext httpContext,
                CancellationToken ct) =>
            {
                var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId is null)
                    return Results.Unauthorized();

                var lessons = await query.GetAccessibleLessonsForStudentAsync(
                    Guid.Parse(userId),
                    ct);

                return Results.Ok(lessons);
            })
            .RequireAuthorization(new AuthorizeAttribute
            {
                Roles = "Student"
            });
        
        // =========================================================
        // GET /api/lessons/published  (Teacher | Admin)
        // Public lessons for product / selling / dashboard views
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
        
        group.MapGet("/{courseId:guid}/course", async (
                Guid courseId,
                ILessonQueryService query,
                CancellationToken ct) =>
            {
                var lessons = await query
                    .GetLessonsByCourseIdAsync(courseId, ct);

                return Results.Ok(lessons);
            })
            .RequireAuthorization(new AuthorizeAttribute
            {
                Roles = "Student"
            });
    }
}