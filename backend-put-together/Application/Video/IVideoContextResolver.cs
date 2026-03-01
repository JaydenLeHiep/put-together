using backend_put_together.Infrastructure.Video;

namespace backend_put_together.Application.Video;

public interface IVideoContextResolver
{
    Task<VideoContext> ResolveForCourseAsync(Guid courseId, CancellationToken ct);
    Task<VideoContext> ResolveForLessonAsync(Guid lessonId, CancellationToken ct);
}