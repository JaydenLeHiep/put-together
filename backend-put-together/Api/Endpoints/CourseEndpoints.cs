using System.Security.Claims;
using backend_put_together.Application.Courses.DTOs;
using backend_put_together.Application.Courses.Queries;
using backend_put_together.Application.Courses.Services;
using Carter;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_put_together.Api.Endpoints;

public sealed class CourseEndpoints : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app
            .MapGroup("/api/courses")
            .WithTags("Courses");

        // =====================================================
        // GET /api/courses
        // Public: get all courses
        // =====================================================
        group.MapGet("", async (
            ICourseQueryService query,
            CancellationToken ct) =>
        {
            var courses = await query.GetAllAsync(ct);
            return Results.Ok(courses);
        });

        // =====================================================
        // GET /api/courses/published
        // Authenticated (Student, Teacher, Admin): get published courses
        // =====================================================
        group.MapGet("/published", async (
                ICourseQueryService query,
                CancellationToken ct) =>
            {
                var courses = await query.GetPublishedAsync(ct);
                return Results.Ok(courses);
            })
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Student,Teacher,Admin" });

        // =====================================================
        // GET /api/courses/{id}
        // Authenticated: get course by id
        // =====================================================
        group.MapGet("/{id:guid}", async (
                Guid id,
                ICourseQueryService query,
                CancellationToken ct) =>
            {
                var course = await query.GetByIdAsync(id, ct);
                return course is null ? Results.NotFound() : Results.Ok(course);
            })
            .RequireAuthorization();

        // =====================================================
        // GET /api/courses/{id}/lessons
        // Public: get course with lessons
        // =====================================================
        group.MapGet("/{id:guid}/lessons", async (
            Guid id,
            ICourseQueryService query,
            CancellationToken ct) =>
        {
            var course = await query.GetCourseWithLessonsAsync(id, ct);
            return course is null ? Results.NotFound() : Results.Ok(course);
        });

        // =====================================================
        // GET /api/courses/student-paid-category-course
        // Student only: get paid courses grouped by category
        // =====================================================
        group.MapGet("/student-paid-category-course", async (
                ICourseQueryService query,
                HttpContext httpContext,
                CancellationToken ct) =>
            {
                var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (userId is null)
                    return Results.Unauthorized();

                if (!Guid.TryParse(userId, out var studentId))
                    return Results.Unauthorized();

                var courses = await query.GetPaidCoursesByStudentIdAsync(studentId, ct);
                return Results.Ok(courses);
            })
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Student" });

        // =====================================================
        // GET /api/courses/public-catalog
        // Public: catalog for home page / "Alle Kurse"
        // Returns categories -> published courses -> lesson previews
        // =====================================================
        group.MapGet("/public-catalog", async (
            ICourseQueryService query,
            CancellationToken ct) =>
        {
            var result = await query.GetPublicCourseCatalogAsync(ct);
            return Results.Ok(result);
        });

        // =====================================================
        // POST /api/courses
        // Admin only: create course
        // =====================================================
        group.MapPost("", async (
                [FromBody] CreateCourseRequest req,
                ICourseService service,
                HttpContext httpContext,
                CancellationToken ct) =>
            {
                var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (userId is null || !Guid.TryParse(userId, out var actorId))
                    return Results.Unauthorized();

                var courseId = await service.CreateAsync(req, actorId, ct);
                return Results.Ok(new { id = courseId });
            })
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });

        // =====================================================
        // PUT /api/courses/{id}
        // Admin only: update course
        // =====================================================
        group.MapPut("/{id:guid}", async (
                Guid id,
                [FromBody] UpdateCourseRequest req,
                ICourseService service,
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
            })
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });

        // =====================================================
        // DELETE /api/courses/{id}
        // Admin only: delete course
        // =====================================================
        group.MapDelete("/{id:guid}", async (
                Guid id,
                ICourseService service,
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
            })
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
    }
}