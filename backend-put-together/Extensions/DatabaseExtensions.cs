using backend_put_together.Data;
using Microsoft.EntityFrameworkCore;

namespace backend_put_together.Extensions;

public static class DatabaseExtensions
{
    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration config)
    {
        var conn = Environment.GetEnvironmentVariable("DATABASE_URL");
        
        if (string.IsNullOrWhiteSpace(conn))
        {
            conn = config.GetConnectionString("DefaultConnection");
        }
        
        if(string.IsNullOrWhiteSpace(conn))
            throw new InvalidOperationException("Could not get connection string");

        services.AddDbContext<AppDbContext>(options => options.UseNpgsql(conn));

        return services;
    }
}