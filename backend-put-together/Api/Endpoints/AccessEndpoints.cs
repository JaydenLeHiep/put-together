using backend_put_together.Application.Access.Services;
using Carter;
using Microsoft.AspNetCore.Authorization;

namespace backend_put_together.Api.Endpoints;

public sealed class AccessEndpoints : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/access");
        
        group.MapGet("/course", async (
                Guid studentId,
                IAccessService service,
                CancellationToken ct) =>
            {
                var courses = await service.GetStudentCourseAccessAsync(studentId, ct);
                return Results.Ok(courses);
            })
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
        
        // POST /api/access/grant-course?studentId=...&courseId=...
        group.MapPost("/grant-course", async (
                Guid studentId,
                Guid courseId,
                IAccessService service,
                CancellationToken ct) =>
            {
                await service.GrantCourseAccessAsync(studentId, courseId, ct);
                return Results.Ok();
            })
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });

        // POST /api/access/revoke-course?studentId=...&courseId=...
        group.MapPost("/revoke-course", async (
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