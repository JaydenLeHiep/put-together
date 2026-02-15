using Microsoft.AspNetCore.Http;

namespace backend_put_together.Application.Lessons.DTOs;

public class CreateLessonRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public Guid CourseId { get; set; } 
    
    // first file is the video, others are documents file
    public IFormFileCollection? Files { get; set; }
}