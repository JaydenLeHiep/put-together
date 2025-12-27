using backend_put_together.Data;
using backend_put_together.Modules.DigitalOceanConnectionHelper;
using Microsoft.EntityFrameworkCore;

namespace backend_put_together.Extensions;

public static class DatabaseExtensions
{
    public static IServiceCollection AddDatabase(
        this IServiceCollection services,
        IConfiguration config)
    {
        var rawConnectionString =
            Environment.GetEnvironmentVariable("DATABASE_URL")
            ?? config.GetConnectionString("DefaultConnection");

        if (string.IsNullOrWhiteSpace(rawConnectionString))
            throw new InvalidOperationException(
                "Connection string is missing. Set DATABASE_URL or DefaultConnection."
            );

        var conn =
            DigitalOceanConnectionHelper.BuildNpgsqlConnectionString(rawConnectionString);

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(conn));

        return services;
    }
}