using backend_put_together.Application.Courses.DTOs;
using backend_put_together.Application.Courses.Services;
using backend_put_together.Application.Courses.Queries;
using Carter;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using backend_put_together.Application.Lessons.Queries;

namespace backend_put_together.Api.Endpoints;

public sealed class CourseEndpoints : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/courses");
        
        // GET /api/courses (All roles can see courses)
        group.MapGet("", async (ICourseQueryService query) =>
        {
            var courses = await query.GetAllAsync();
            return Results.Ok(courses);
        })
        .RequireAuthorization();
        
        // GET /api/courses/published (Public published courses)
        group.MapGet("/published", async (ICourseQueryService query) =>
        {
            var courses = await query.GetPublishedAsync();
            return Results.Ok(courses);
        })
        .RequireAuthorization(new AuthorizeAttribute { Roles = "Student,Teacher,Admin" });
        
        // GET /api/courses/{id}
        group.MapGet("{id:guid}", async (Guid id, ICourseQueryService query) =>
        {
            var course = await query.GetByIdAsync(id);
            return course is null ? Results.NotFound() : Results.Ok(course);
        })
        .RequireAuthorization();
        
        // POST /api/courses (Admin only)
        group.MapPost("", async (
            [FromBody] CreateCourseRequest req,
            ICourseService service,
            HttpContext httpContext,
            CancellationToken ct) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null) return Results.Unauthorized();
            
            var courseId = await service.CreateAsync(req, Guid.Parse(userId), ct);
            return Results.Ok(new { id = courseId });
        })
        .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
        
        // PUT /api/courses/{id} (Admin only)
        group.MapPut("{id:guid}", async (
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
        
        // DELETE /api/courses/{id} (Admin only)
        group.MapDelete("{id:guid}", async (
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
        
        // POST /api/courses/{id}/publish (Admin only)
        group.MapPost("{id:guid}/publish", async (
            Guid id,
            ICourseService service,
            CancellationToken ct) =>
        {
            try
            {
                await service.PublishAsync(id, ct);
                return Results.Ok();
            }
            catch (KeyNotFoundException)
            {
                return Results.NotFound();
            }
        })
        .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
        
        // GET /api/courses/{id}/lessons
        group.MapGet("{id:guid}/lessons", async (
                Guid id, 
                ICourseQueryService query) =>
            {
                var course = await query.GetCourseWithLessonsAsync(id);
                return course is null ? Results.NotFound() : Results.Ok(course);
            })
            .RequireAuthorization();
        
        group.MapGet("/student-paid-category-course", async (
                ICourseQueryService query,
                HttpContext httpContext,
                CancellationToken ct) =>
            {
                var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                
                if (userId is null)
                    return Results.Unauthorized();
                
                if(!Guid.TryParse(userId, out var studentId))
                    return Results.Unauthorized();
                
                var course = await query.GetPaidCoursesByStudentIdAsync(studentId, ct);
                return Results.Ok(course);
            })
            .RequireAuthorization(new AuthorizeAttribute
            {
                Roles = "Student"
            });
    }
}