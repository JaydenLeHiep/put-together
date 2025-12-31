namespace backend_put_together.Infrastructure.Scheduling;

public sealed class CronOptions
{
    public TimeSpan OrphanCleanupInterval { get; set; } = TimeSpan.FromHours(6);
    public TimeSpan HardDeleteInterval { get; set; } = TimeSpan.FromDays(1);
    public int HardDeleteAfterDays { get; set; } = 30;
}