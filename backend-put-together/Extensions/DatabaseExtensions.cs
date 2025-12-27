using backend_put_together.Data;
using backend_put_together.Modules.DigitalOceanConnectionHelper;
using Microsoft.EntityFrameworkCore;
using Npgsql;

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
        
        Console.WriteLine(conn);
        
        if(string.IsNullOrWhiteSpace(conn))
            throw new InvalidOperationException("Could not get connection string");
        
        var npgsqlBuilder = new NpgsqlConnectionStringBuilder(conn)
        {
            // Optional but recommended for DO
            SslMode = SslMode.Require,
            TrustServerCertificate = true
        };

        var finalConn = npgsqlBuilder.ConnectionString;

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(finalConn));

        services.AddDbContext<AppDbContext>(options => options.UseNpgsql(finalConn));
        
        Console.WriteLine(services);

        return services;
    }
}