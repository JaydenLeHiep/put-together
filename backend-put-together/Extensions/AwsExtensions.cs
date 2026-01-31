using Amazon.S3;

namespace backend_put_together.Extensions;

public static class AwsExtensions
{
    public static IServiceCollection AddAws(this IServiceCollection services, IConfiguration config)
    {
        services.AddDefaultAWSOptions(config.GetAWSOptions());
        services.AddAWSService<IAmazonS3>();  // AWS S3 service
        
        return services;
    }
}