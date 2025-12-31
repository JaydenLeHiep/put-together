using Microsoft.AspNetCore.Http;

namespace backend_put_together.Application.Lessons.DTOs;

public sealed class UpdateLessonRequest
{
    public string Title { get; init; } = null!;
    public string? Content { get; init; }

    // Optional: replace video
    public IFormFile? File { get; init; }
    public string? VideoLibraryId { get; init; }
}