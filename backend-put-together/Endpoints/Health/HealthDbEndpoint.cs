using System.Data.Common;
using backend_put_together.Data;
using Carter;
using Npgsql;

namespace backend_put_together.Endpoints.Health;

public class HealthDbEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/health/db", async (IConfiguration config, ILogger<HealthDbEndpoint> logger) =>
        {
            try
            {
                await using var conn = new NpgsqlConnection(
                    config.GetConnectionString("DefaultConnection"));

                await conn.OpenAsync();
                return Results.Ok("Connected");
            }
            catch (NpgsqlException ex)
            {
                logger.LogError(ex,  "Could not connect to database");

                return Results.Problem(
                    title: "PostgreSQL connection error",
                    detail: ex.Message,
                    statusCode: 500);
            }
            catch (TimeoutException ex)
            {
                logger.LogError(ex, "Database connection timeout");

                return Results.Problem(
                    title: "Database timeout",
                    detail: ex.Message,
                    statusCode: 500);
            }
            catch (DbException ex)
            {
                logger.LogError(ex, "Database provider error");

                return Results.Problem(
                    title: "Database error",
                    detail: ex.Message,
                    statusCode: 500);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unexpected database error");

                return Results.Problem(
                    title: "Unexpected error",
                    detail: ex.Message,
                    statusCode: 500);
            }
        });
    }
}