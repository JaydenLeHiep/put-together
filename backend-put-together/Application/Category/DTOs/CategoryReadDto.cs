namespace backend_put_together.Application.Category.DTOs;

public class CategoryReadDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string BunnyLibraryId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int CourseCount { get; set; }
}