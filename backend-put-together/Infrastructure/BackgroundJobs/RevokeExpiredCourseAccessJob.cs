using backend_put_together.Infrastructure.Data;
using backend_put_together.Infrastructure.Scheduling;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace backend_put_together.Infrastructure.BackgroundJobs;

public sealed class RevokeExpiredCourseAccessJob : IBackgroundJob
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly CronOptions _options;

    public RevokeExpiredCourseAccessJob(
        IServiceScopeFactory scopeFactory,
        IOptions<CronOptions> options)
    {
        _scopeFactory = scopeFactory;
        _options = options.Value;
    }

    public TimeSpan Interval => _options.RevokeExpiredCourseAccessInterval;

    public async Task ExecuteAsync(CancellationToken ct)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var now = DateTime.UtcNow;

        // Mark expired rows as revoked (keep audit trail)
        await db.StudentCourseAccess
            .Where(x => x.RevokedAtUtc == null && x.ExpiresAtUtc < now)
            .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.RevokedAtUtc, now),
                ct);
    }
}