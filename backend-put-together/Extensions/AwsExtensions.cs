using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.SimpleEmail;

namespace backend_put_together.Extensions;

public static class AwsExtensions
{
    public static IServiceCollection AddAws(this IServiceCollection services, IConfiguration config)
    {
        var accessKey = config["AWS:AccessKey"];
        var secretKey = config["AWS:SecretKey"];
        var region = config["AWS:Region"];
        var regionEndpoint = RegionEndpoint.GetBySystemName(region);

        var credentials = new BasicAWSCredentials(accessKey, secretKey);

        services.AddSingleton<IAmazonS3>(
            new AmazonS3Client(credentials, regionEndpoint)
        );

        services.AddSingleton<IAmazonSimpleEmailService>(
            new AmazonSimpleEmailServiceClient(credentials, regionEndpoint)
        );

        return services;
    }
}