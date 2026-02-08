using backend_put_together.Application.Access.Services;
using backend_put_together.Application.Category.Queries;
using backend_put_together.Application.Category.Services;
using backend_put_together.Application.Courses.Queries;
using backend_put_together.Application.Courses.Services;
using backend_put_together.Application.Lessons.Queries;
using backend_put_together.Application.Lessons.Services;
using backend_put_together.Application.Users.Queries;
using backend_put_together.Application.Users.Services;
using backend_put_together.Application.Video;
using backend_put_together.Domain.Users;
using backend_put_together.Infrastructure.BackgroundJobs;
using backend_put_together.Infrastructure.PasswordHasher;
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
        services.AddScoped<BunnyCollectionClient>();
        services.AddScoped<BunnyVideoAdminClient>();
        
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IUserQueryService, UserQueryService>();
        services.AddScoped<PasswordHasher<User>>();
        services.AddScoped<IAppPasswordHasher, AppPasswordHasher>();
        
        services.AddScoped<ILessonCommentService, LessonCommentService>();
        services.AddScoped<ILessonCommentQueryService, LessonCommentQueryService>();
        
        // Background jobs (scoped!)
        services.AddScoped<HardDeleteLessonsJob>();
        services.AddScoped<OrphanBunnyCleanupJob>();
        services.AddHttpClient<BunnyLibraryClient>();
        
        // Scheduler (singleton)
        services.AddHostedService<CronHostedService>();

        // Cron options
        services.Configure<CronOptions>(opts =>
        {
            opts.OrphanCleanupInterval = TimeSpan.FromHours(6);
            opts.HardDeleteInterval = TimeSpan.FromDays(1);
            opts.HardDeleteAfterDays = 30;
        });

        // Courses
        services.AddScoped<ICourseService, CourseService>();
        services.AddScoped<ICourseQueryService, CourseQueryService>();

        // Access Control
        services.AddScoped<IAccessService, AccessService>();
        
        // Categories
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<ICategoryQueryService, CategoryQueryService>();
        
        services.AddScoped<IVideoContextResolver, VideoContextResolver>();
        
        return services;
    }
}