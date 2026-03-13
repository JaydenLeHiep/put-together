namespace backend_put_together.Application.Lessons.DTOs;

public sealed class UpdateLessonRequest
{
    public string Title { get; init; } = null!;
    public string? Content { get; init; }
    public IFormFileCollection? Files { get; init; }
    public List<Guid>? DeleteFileIds { get; init; }
}