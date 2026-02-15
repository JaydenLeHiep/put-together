using System.ComponentModel.DataAnnotations;
using backend_put_together.Application.Users.DTOs;
using backend_put_together.Application.Users.Queries;
using backend_put_together.Application.Users.Services;
using backend_put_together.Application.Users.Shared;
using backend_put_together.Infrastructure.Tokens;
using Carter;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace backend_put_together.Api.Endpoints;

public class UserEndpoints : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users");

        group.MapPost("/", async (
                [FromBody] CreateUserRequest req,
                IUserService service,
                CancellationToken ct,
                ILogger<UserEndpoints> logger) =>
            {
                try
                {
                    if (string.IsNullOrWhiteSpace(req.UserName))
                        return Results.BadRequest("username is required");

                    if (string.IsNullOrWhiteSpace(req.Email))
                        return Results.BadRequest("email is required");
                    
                    if (!new EmailAddressAttribute().IsValid(req.Email))
                        return Results.BadRequest("invalid email address");
                    
                    if (string.IsNullOrWhiteSpace(req.Password))
                        return Results.BadRequest("password is required");
                    
                    if(req.Password.Length < 8)
                        return Results.BadRequest("password must be at least 8 characters long");

                    await service.CreateAsync(req, ct);
                    return Results.Created();
                }
                catch (DbUpdateException ex) when (ex.InnerException is PostgresException pg)
                {
                    if (pg.SqlState == PostgresErrorCodes.UniqueViolation)
                    {
                        logger.LogDebug("Unique constraint violation: {0}", pg.ConstraintName);
                        return pg.ConstraintName switch
                        {
                            "ix_users_email" => Results.Conflict("email already exists!"),
                            "ix_users_user_name" => Results.Conflict("username already exists!"),
                            _ => Results.Conflict("user already exists!")
                        };
                    }

                    logger.LogError(pg, "An unknown error occurred while creating the user");
                    return Results.Problem();
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Unhandled exception during user registration!");
                    return Results.BadRequest("Something went wrong!");
                }
            })
            .DisableAntiforgery();

        group.MapPost("/login", async (
                [FromBody] LoginUserRequest req,
                IUserQueryService service,
                HttpContext httpContext,
                IWebHostEnvironment env,
                CancellationToken ct,
                ILogger<UserEndpoints> logger) =>
            {
                try
                {
                    if (string.IsNullOrWhiteSpace(req.Identifier))
                        return Results.BadRequest("username or email is required");

                    if (string.IsNullOrWhiteSpace(req.Password))
                        return Results.BadRequest("password is required");
                
                    var loginResult = await service.LoginAsync(req, ct);
                    if (!loginResult.Success)
                    {
                        return Results.Json(
                            new { message = "Invalid username or password" },
                            statusCode: StatusCodes.Status401Unauthorized
                        );
                    }
                    
                    if (loginResult.RefreshToken != null)
                    {
                        TokenHelper.SendRefreshTokenInCookie(loginResult.RefreshToken, env, httpContext);

                        return Results.Ok(new
                        {
                            accessToken = loginResult.AccessToken,
                            userInfo = loginResult.UserInfo
                        });
                    }
                }
                catch (Exception e)
                {
                    logger.LogError(e, "Unhandled exception during login user");
                    return Results.BadRequest("Something went wrong!");
                }

                return Results.Unauthorized();
            })
            .DisableAntiforgery();
        
        group.MapPost("/refresh", async (
                HttpContext httpContext,
                IUserQueryService service,
                IWebHostEnvironment env,
                CancellationToken ct,
                ILogger<UserEndpoints> logger) =>
            {
                try
                {
                    var refreshToken = httpContext.Request.Cookies["refreshToken"];

                    if (string.IsNullOrWhiteSpace(refreshToken))
                    {
                        return Results.Unauthorized();
                    }

                    var refreshResult = await service.RefreshAsync(refreshToken, ct);

                    if (!refreshResult.Success)
                    {
                        return Results.Json(
                            new { message = "Invalid refresh token" },
                            statusCode: StatusCodes.Status401Unauthorized
                        );
                    }

                    if (refreshResult.RefreshToken != null)
                    {
                        TokenHelper.SendRefreshTokenInCookie(refreshResult.RefreshToken, env, httpContext);

                        return Results.Ok(new
                        {
                            accessToken = refreshResult.AccessToken,
                            userInfo = refreshResult.UserInfo
                        });
                    }
                }
                catch (Exception e)
                {
                    logger.LogError(e, "Unhandled exception during refresh token");
                    return Results.BadRequest("Something went wrong!");
                }
                return Results.Unauthorized();
            })
            .DisableAntiforgery();
        
        group.MapPost("/logout", async (
                HttpContext httpContext,
                IUserQueryService service,
                IWebHostEnvironment env,
                CancellationToken ct,
                ILogger<UserEndpoints> logger) =>
            {
                try
                {
                    var refreshToken = httpContext.Request.Cookies["refreshToken"];

                    if (!string.IsNullOrWhiteSpace(refreshToken))
                    {
                        await service.LogoutAsync(refreshToken, ct);
                    }

                    if (refreshToken != null) TokenHelper.DeleteRefreshTokenInCookie(env, httpContext);

                    return Results.Ok();
                }
                catch (Exception e)
                {
                    logger.LogError(e, "Unhandled exception during logout");
                    return Results.BadRequest("Something went wrong!");
                }
            })
            .DisableAntiforgery();
        
        // GET /api/users/all (Admin only)
        group.MapGet("/all", async (IUserQueryService query) =>
            {
                var users = await query.GetAllUsersAsync();
                return Results.Ok(users);
            })
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });

        // GET /api/users/role/{role} (Admin only)
        group.MapGet("/role/{role}", async (string role, IUserQueryService query, CancellationToken ct) =>
            {
                if (!Enum.TryParse<Role>(role, true, out _))
                    return Results.BadRequest("invalid role");

                var users = await query.GetUsersByRoleAsync(role, ct);
                return Results.Ok(users);
            })
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
        
        group.MapGet("/{id:guid}", async (
                Guid id,
                IUserQueryService query,
                CancellationToken ct) =>
            {
                var user = await query.GetUserByIdAsync(id, ct);
                return user == null ? Results.NotFound() : Results.Ok(user);
            })
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
        
        group.MapPatch("/{id:guid}/role", async (
                Guid id,
                [FromBody] UpdateUserRoleRequest req,
                IUserService service,
                CancellationToken ct) =>
            {
                if (string.IsNullOrWhiteSpace(req.Role))
                    return Results.BadRequest("role is required");

                // Only allow Student / Teacher
                var normalized = req.Role.Trim();
                if (!string.Equals(normalized, "Student", StringComparison.OrdinalIgnoreCase) &&
                    !string.Equals(normalized, "Teacher", StringComparison.OrdinalIgnoreCase))
                {
                    return Results.BadRequest("only Student or Teacher is allowed");
                }

                var ok = await service.UpdateRoleStudentTeacherOnlyAsync(id, normalized, ct);

                return ok switch
                {
                    UpdateRoleResult.Success => Results.Ok(),
                    UpdateRoleResult.UserNotFound => Results.NotFound(),
                    UpdateRoleResult.TargetIsAdmin => Results.Forbid(),
                    UpdateRoleResult.InvalidRole => Results.BadRequest("invalid role"),
                    _ => Results.BadRequest("update role failed")
                };
            })
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
        
        group.MapPatch("/{id:guid}/deactivate", async (
                Guid id,
                IUserQueryService query,
                IUserService service,
                CancellationToken ct) =>
            {
                var details = await query.GetUserByIdAsync(id, ct);
                if (details == null) return Results.NotFound();
                if (details.RoleName == "Admin") return Results.Forbid();

                var ok = await service.DeactivateAsync(id, ct);
                return ok ? Results.Ok() : Results.BadRequest();
            })
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });

        group.MapPatch("/{id:guid}/activate", async (
                Guid id,
                IUserService service,
                CancellationToken ct) =>
            {
                var ok = await service.ActivateAsync(id, ct);
                return ok ? Results.Ok() : Results.NotFound();
            })
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
        
        group.MapPost("/{id:guid}/reset-password", async (
                Guid id,
                [FromBody] ResetPasswordRequest req,
                IUserService service,
                CancellationToken ct) =>
            {
                var ok = await service.ResetPasswordAsync(id, req.NewPassword, ct);
                return ok ? Results.Ok() : Results.BadRequest("Reset password failed");
            })
            .RequireAuthorization(new AuthorizeAttribute { Roles = "Admin" });
    }
}