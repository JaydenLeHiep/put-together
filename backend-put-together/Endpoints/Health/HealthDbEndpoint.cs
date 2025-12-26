using backend_put_together.Data;
using Carter;

namespace backend_put_together.Endpoints.Health;

public class HealthDbEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/health/db", async (AppDbContext db, ILogger<HealthDbEndpoint> logger) =>
        {
            try
            {
                var canConnect = await db.Database.CanConnectAsync();
                logger.LogInformation("Connect to database!");
                return Results.Ok(new
                {
                    ok = canConnect
                });
            }
            catch (Exception e)
            {
                logger.LogError(e, "An error occured");
                return Results.Problem(
                    title: "Database connection failed",
                    detail: e.Message,
                    statusCode: 500);
            }
        });
    }
}