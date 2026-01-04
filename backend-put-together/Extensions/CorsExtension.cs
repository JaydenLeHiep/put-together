namespace backend_put_together.Extensions;

public static class CorsExtension
{
    private const string PolicyName = "FrontendCors";
    public static IServiceCollection AddCors(this IServiceCollection services, IConfiguration config)
    {
        var listOfAllowedCorsOrigins = config.GetSection("AllowedCorsOrigins").Get<List<string>>();

        if (listOfAllowedCorsOrigins == null)
        {
            throw new InvalidOperationException("AllowedCorsOrigins are not configured");
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