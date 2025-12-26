using Carter;
namespace backend_put_together.Extensions;

public static class ApplicationExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddCarter();
        return services;
    }
}