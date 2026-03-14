using backend_put_together.Application.Category.DTOs;
using backend_put_together.Application.Category.Queries;
using backend_put_together.Application.Category.Services;
using Carter;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_put_together.Api.Endpoints;

public sealed class CategoryEndpoints : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app
            .MapGroup("/api/categories")
            .WithTags("Categories");

        // =====================================================
        // GET /api/categories
        // Public: get all categories
        // =====================================================
        group.MapGet("", async (
            ICategoryQueryService query,
            CancellationToken ct) =>
        {
            var result = await query.GetAllAsync(ct);
            return Results.Ok(result);
        });

        // =====================================================
        // POST /api/categories
        // Admin only: create category
        // =====================================================
        group.MapPost("", [Authorize(Roles = "Admin")] async (
            [FromBody] CreateCategoryRequestDto req,
            ICategoryService service,
            CancellationToken ct) =>
        {
            var id = await service.CreateAsync(req, ct);
            return Results.Created($"/api/categories/{id}", new { id });
        });

        // =====================================================
        // PUT /api/categories/{id}
        // Admin only: update category
        // =====================================================
        group.MapPut("/{id:guid}", [Authorize(Roles = "Admin")] async (
            [FromRoute] Guid id,
            [FromBody] UpdateCategoryRequestDto req,
            ICategoryService service,
            CancellationToken ct) =>
        {
            try
            {
                await service.UpdateAsync(id, req, ct);
                return Results.NoContent();
            }
            catch (InvalidOperationException ex) when (
                ex.Message.Contains("not found", StringComparison.OrdinalIgnoreCase))
            {
                return Results.NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return Results.BadRequest(ex.Message);
            }
        });

        // =====================================================
        // DELETE /api/categories/{id}
        // Admin only: delete category
        // =====================================================
        group.MapDelete("/{id:guid}", [Authorize(Roles = "Admin")] async (
            [FromRoute] Guid id,
            ICategoryService service,
            CancellationToken ct) =>
        {
            try
            {
                await service.DeleteAsync(id, ct);
                return Results.NoContent();
            }
            catch (InvalidOperationException ex) when (
                ex.Message.Contains("not found", StringComparison.OrdinalIgnoreCase))
            {
                return Results.NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return Results.BadRequest(ex.Message);
            }
        });
    }
}