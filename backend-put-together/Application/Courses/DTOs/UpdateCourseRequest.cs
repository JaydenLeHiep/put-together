namespace backend_put_together.Application.Courses.DTOs;

public sealed class UpdateCourseRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Level { get; set; }
    public decimal? Price { get; set; }
    public bool? IsPublished { get; set; }
}