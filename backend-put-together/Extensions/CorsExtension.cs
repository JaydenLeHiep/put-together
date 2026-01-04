using Serilog;
namespace backend_put_together.Extensions;

public static class CorsExtension
{
    private const string PolicyName = "FrontendCors";
    public static IServiceCollection AddCors(this IServiceCollection services, IConfiguration config)
    {
        var listOfAllowedCorsOrigins = config.GetSection("Cors:AllowedOrigins").Get<List<string>>();

        if (listOfAllowedCorsOrigins == null || listOfAllowedCorsOrigins.Count == 0)
        {
            listOfAllowedCorsOrigins = new List<string>();
            Log.Warning("CORS: No allowed origins configured");
        }

        services.AddCors(options => options.AddPolicy(PolicyName, policy => 
            policy
            .WithOrigins(
                listOfAllowedCorsOrigins.ToArray()
            )
            .AllowAnyHeader()
            .AllowAnyMethod()));

        return services;
    }
}