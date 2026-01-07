using System.ComponentModel.DataAnnotations;
using backend_put_together.Application.Users.DTOs;
using backend_put_together.Application.Users.Queries;
using backend_put_together.Application.Users.Services;
using Carter;
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
                CancellationToken ct) =>
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

                return Results.Ok(new
                {
                    userId = loginResult.UserId,
                    token = loginResult.AccessToken
                    // token will go here later
                });
            })
            .DisableAntiforgery();
    }
}