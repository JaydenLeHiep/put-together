using backend_put_together.Application.Lessons.Queries;
using backend_put_together.Application.Lessons.Services;
using backend_put_together.Infrastructure.BackgroundJobs;
using backend_put_together.Infrastructure.Scheduling;
using Carter;

namespace backend_put_together.Extensions;

public static class ApplicationExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddCarter();

        // Application
        services.AddScoped<ILessonService, LessonService>();
        services.AddScoped<ILessonQueryService, LessonQueryService>();

        // Background jobs (scoped!)
        services.AddScoped<HardDeleteLessonsJob>();
        services.AddScoped<OrphanBunnyCleanupJob>();

        // Scheduler (singleton)
        services.AddHostedService<CronHostedService>();

        // Cron options
        services.Configure<CronOptions>(opts =>
        {
            opts.OrphanCleanupInterval = TimeSpan.FromHours(6);
            opts.HardDeleteInterval = TimeSpan.FromDays(1);
            opts.HardDeleteAfterDays = 30;
        });

        return services;
    }
}