using backend_put_together.Infrastructure.Data;
using backend_put_together.Infrastructure.Video;
using backend_put_together.Infrastructure.Video.Bunny;
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

        // =============================
        // Collect DB video references
        // =============================
        var dbVideos = await db.Lessons
            .IgnoreQueryFilters()
            .Select(x => new { x.VideoLibraryId, x.VideoGuid })
            .Where(x => x.VideoLibraryId != null && x.VideoGuid != null)
            .Distinct()
            .ToListAsync(ct);

        var dbVideoSet = dbVideos
            .Select(x => $"{x.VideoLibraryId}:{x.VideoGuid}")
            .ToHashSet();

        // =============================
        // Resolve libraries → categories (to get API keys)
        // =============================
        var libraryIds = dbVideos
            .Select(x => x.VideoLibraryId!)
            .Distinct()
            .ToList();

        var libraryCategories = await db.Categories
            .IgnoreQueryFilters()
            .Where(c => libraryIds.Contains(c.BunnyLibraryId))
            .Select(c => new
            {
                c.BunnyLibraryId,
                c.BunnyStreamApiKey
            })
            .ToListAsync(ct);

        // =============================
        // Compare Bunny storage
        // =============================
        foreach (var lib in libraryCategories)
        {
            IReadOnlyList<string> bunnyVideos;

            try
            {
                bunnyVideos = await bunnyAdmin.GetAllVideoGuidsAsync(
                    lib.BunnyLibraryId,
                    lib.BunnyStreamApiKey,
                    ct);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(
                    $"[ORPHAN-CLEANUP] Failed to fetch videos for library {lib.BunnyLibraryId}: {ex.Message}");
                continue;
            }

            foreach (var guid in bunnyVideos)
            {
                var key = $"{lib.BunnyLibraryId}:{guid}";

                // =============================
                // Orphan → delete
                // =============================
                if (!dbVideoSet.Contains(key))
                {
                    try
                    {
                        await videoProvider.DeleteAsync(
                            lib.BunnyLibraryId,
                            lib.BunnyStreamApiKey,
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