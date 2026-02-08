using backend_put_together.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend_put_together.Application.Video;

public sealed class VideoContextResolver : IVideoContextResolver
{
    private readonly AppDbContext _db;

    public VideoContextResolver(AppDbContext db)
    {
        _db = db;
    }

    public async Task<VideoContext> ResolveForCourseAsync(
        Guid courseId,
        CancellationToken ct)
    {
        var course = await _db.Courses
            .Include(c => c.Category)
            .FirstAsync(c => c.Id == courseId, ct);

        return new VideoContext
        {
            LibraryId = course.Category.BunnyLibraryId,
            StreamApiKey = course.Category.BunnyStreamApiKey,
            CollectionId = course.BunnyCollectionId
        };
    }

    public async Task<VideoContext> ResolveForLessonAsync(
        Guid lessonId,
        CancellationToken ct)
    {
        var lesson = await _db.Lessons
            .Include(l => l.Course)
            .ThenInclude(c => c.Category)
            .FirstAsync(l => l.Id == lessonId, ct);

        return new VideoContext
        {
            LibraryId = lesson.Course.Category.BunnyLibraryId,
            StreamApiKey = lesson.Course.Category.BunnyStreamApiKey,
            CollectionId = lesson.Course.BunnyCollectionId
        };
    }
}