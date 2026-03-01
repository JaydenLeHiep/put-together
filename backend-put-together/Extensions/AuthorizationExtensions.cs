namespace backend_put_together.Extensions;

public static class AuthorizationExtensions
{
    public static IServiceCollection AddAuthorizationPolicy(this IServiceCollection services)
    {
        services.AddAuthorization(options =>
        {
            options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
            options.AddPolicy("TeacherOnly", policy => policy.RequireRole("Teacher"));
            options.AddPolicy("StudentOnly", policy => policy.RequireRole("Student"));
        });
        return services;
    }
}