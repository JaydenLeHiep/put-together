using backend_put_together.Infrastructure.Data;
using backend_put_together.Infrastructure.Scheduling;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace backend_put_together.Infrastructure.BackgroundJobs;

public sealed class CourseAccessCleanupJob : IBackgroundJob
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly CronOptions _options;

    public CourseAccessCleanupJob(
        IServiceScopeFactory scopeFactory,
        IOptions<CronOptions> options)
    {
        _scopeFactory = scopeFactory;
        _options = options.Value;
    }

    public TimeSpan Interval => _options.CourseAccessCleanupInterval;

    public async Task ExecuteAsync(CancellationToken ct)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var now = DateTime.UtcNow;
        var cutoff = now.AddDays(-_options.CourseAccessCleanupAfterDays);

        // Delete:
        // 1) revoked long ago
        // 2) expired long ago (even if not revoked yet)
        await db.StudentCourseAccess
            .Where(x =>
                (x.RevokedAtUtc != null && x.RevokedAtUtc < cutoff) ||
                (x.ExpiresAtUtc < cutoff)
            )
            .ExecuteDeleteAsync(ct);
    }
}