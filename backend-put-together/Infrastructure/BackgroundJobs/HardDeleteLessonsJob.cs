using backend_put_together.Infrastructure.Scheduling;
using backend_put_together.Infrastructure.Data;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

public sealed class HardDeleteLessonsJob : IBackgroundJob
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly CronOptions _options;

    public HardDeleteLessonsJob(
        IServiceScopeFactory scopeFactory,
        IOptions<CronOptions> options)
    {
        _scopeFactory = scopeFactory;
        _options = options.Value;
    }

    public TimeSpan Interval => _options.HardDeleteInterval;

    public async Task ExecuteAsync(CancellationToken ct)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var cutoff = DateTime.UtcNow.AddDays(-_options.HardDeleteAfterDays);

        var lessons = await db.Lessons
            .IgnoreQueryFilters() 
            .Where(x =>
                x.IsDeleted &&
                x.DeletedAt.HasValue &&     
                x.DeletedAt.Value < cutoff) 
            .ToListAsync(ct);

        if (lessons.Count == 0)
            return;

        db.Lessons.RemoveRange(lessons);
        await db.SaveChangesAsync(ct);
    }
}