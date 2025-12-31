namespace backend_put_together.Infrastructure.Scheduling;

public interface IBackgroundJob
{
    TimeSpan Interval { get; }   
    Task ExecuteAsync(CancellationToken ct);
}