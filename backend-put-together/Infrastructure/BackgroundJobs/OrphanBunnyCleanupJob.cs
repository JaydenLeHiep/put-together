using backend_put_together.Data;
using backend_put_together.Infrastructure.Video;
using backend_put_together.Modules.Video;
using backend_put_together.Infrastructure.Scheduling;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace backend_put_together.Infrastructure.BackgroundJobs;

public sealed class OrphanBunnyCleanupJob : IBackgroundJob
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly CronOptions _options;

    public OrphanBunnyCleanupJob(
        IServiceScopeFactory scopeFactory,
        IOptions<CronOptions> options)
    {
        _scopeFactory = scopeFactory;
        _options = options.Value;
    }

    public TimeSpan Interval => _options.OrphanCleanupInterval;

    public async Task ExecuteAsync(CancellationToken ct)
    {
        using var scope = _scopeFactory.CreateScope();

        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var bunnyAdmin = scope.ServiceProvider.GetRequiredService<BunnyVideoAdminClient>();
        var videoProvider = scope.ServiceProvider.GetRequiredService<IVideoProvider>();
        
        // 1) Collect DB video references
        var dbVideos = await db.Lessons
            .IgnoreQueryFilters()
            .Select(x => new { x.VideoLibraryId, x.VideoGuid })
            .Distinct()
            .ToListAsync(ct);

        var dbVideoSet = dbVideos
            .Select(x => $"{x.VideoLibraryId}:{x.VideoGuid}")
            .ToHashSet();

        var libraries = dbVideos
            .Select(x => x.VideoLibraryId)
            .Distinct();
        
        // 2) Compare with Bunny storage
        foreach (var libraryId in libraries)
        {
            IReadOnlyList<string> bunnyVideos;

            try
            {
                bunnyVideos = await bunnyAdmin
                    .GetAllVideoGuidsAsync(libraryId, ct);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(
                    $"[ORPHAN-CLEANUP] Failed to fetch videos for library {libraryId}: {ex.Message}");
                continue;
            }

            foreach (var guid in bunnyVideos)
            {
                var key = $"{libraryId}:{guid}";
                // 3) Orphan → delete
                if (!dbVideoSet.Contains(key))
                {
                    try
                    {
                        await videoProvider.DeleteAsync(
                            libraryId,
                            guid,
                            ct);
                    }
                    catch (Exception ex)
                    {
                        Console.Error.WriteLine(
                            $"[ORPHAN-CLEANUP] Failed to delete {guid}: {ex.Message}");
                    }
                }
            }
        }
    }
}