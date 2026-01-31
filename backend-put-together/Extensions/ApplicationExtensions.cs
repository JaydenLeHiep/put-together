using backend_put_together.Application.Lessons.Queries;
using backend_put_together.Application.Lessons.Services;
using backend_put_together.Application.Storage.Queries;
using backend_put_together.Application.Storage.Services;
using backend_put_together.Application.Users.Queries;
using backend_put_together.Application.Users.Services;
using backend_put_together.Domain.Users;
using backend_put_together.Infrastructure.BackgroundJobs;
using backend_put_together.Infrastructure.PasswordHasher;
using backend_put_together.Infrastructure.S3StoredFileService;
using backend_put_together.Infrastructure.Scheduling;
using backend_put_together.Infrastructure.Video;
using backend_put_together.Infrastructure.Video.Bunny;
using Carter;
using Microsoft.AspNetCore.Identity;

namespace backend_put_together.Extensions;

public static class ApplicationExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddCarter();

        // Application
        services.AddScoped<ILessonService, LessonService>();
        services.AddScoped<ILessonQueryService, LessonQueryService>();
        services.AddScoped<IVideoProvider, BunnyVideoProvider>();
        
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IUserQueryService, UserQueryService>();
        services.AddScoped<PasswordHasher<User>>();
        services.AddScoped<IAppPasswordHasher, AppPasswordHasher>();
        
        services.AddScoped<IS3StoredFileService, S3StoredFileService>();
        services.AddScoped<IStoredFileService, StoredFileService>();
        services.AddScoped<IStoredFileQueryService, StoredFileQueryService>();
        
        services.AddScoped<HardDeleteLessonsJob>();
        services.AddScoped<OrphanBunnyCleanupJob>();
        
        services.AddHostedService<CronHostedService>();
        
        services.Configure<CronOptions>(opts =>
        {
            opts.OrphanCleanupInterval = TimeSpan.FromHours(6);
            opts.HardDeleteInterval = TimeSpan.FromDays(1);
            opts.HardDeleteAfterDays = 30;
        });

        return services;
    }
}