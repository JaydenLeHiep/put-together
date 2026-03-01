namespace backend_put_together.Application.Courses.DTOs;

public sealed class CreateCourseRequest
{
    public Guid CategoryId { get; set; } 
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty; // A1, A2, B1, B2
    public decimal? Price { get; set; }
}