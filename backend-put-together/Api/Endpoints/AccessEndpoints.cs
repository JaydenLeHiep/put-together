using backend_put_together.Application.Access.Services;
using Carter;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend_put_together.Api.Endpoints;

public sealed class AccessEndpoints : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/access");
        
        // POST /api/access/course (Admin only)
        group.MapPost("/course", async (
                Guid studentId,
                Guid courseId,
                IAccessService service,
                HttpContext httpContext,
                CancellationToken ct) =>
            {
                var adminId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (adminId is null) return Results.Unauthorized();
            
                await service.GrantCourseAccessAsync(studentId, courseId, Guid.Parse(adminId), ct);
                return Results.Ok();
            })
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });

        // DELETE /api/access/course (Admin only)
        group.MapDelete("/course", async (
                Guid studentId,
                Guid courseId,
                IAccessService service,
                CancellationToken ct) =>
            {
                await service.RevokeCourseAccessAsync(studentId, courseId, ct);
                return Results.Ok();
            })
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
    }
}