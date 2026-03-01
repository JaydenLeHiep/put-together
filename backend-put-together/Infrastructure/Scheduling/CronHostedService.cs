using backend_put_together.Infrastructure.Scheduling;
using backend_put_together.Infrastructure.BackgroundJobs;

public sealed class CronHostedService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public CronHostedService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await Task.WhenAll(
            RunJobAsync<HardDeleteLessonsJob>(stoppingToken),
            RunJobAsync<OrphanBunnyCleanupJob>(stoppingToken),
            RunJobAsync<RevokeExpiredCourseAccessJob>(stoppingToken),
            RunJobAsync<CourseAccessCleanupJob>(stoppingToken)
        );
    }

    private async Task RunJobAsync<TJob>(CancellationToken ct)
        where TJob : IBackgroundJob
    {
        while (!ct.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();
            var job = scope.ServiceProvider.GetRequiredService<TJob>();

            await Task.Delay(job.Interval, ct);
            await job.ExecuteAsync(ct);
        }
    }
}