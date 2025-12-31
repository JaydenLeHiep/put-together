using Microsoft.AspNetCore.Http;

namespace backend_put_together.Application.Lessons.DTOs;

public class CreateLessonRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? VideoLibraryId { get; set; }
    public IFormFile File { get; set; } = default!;
}