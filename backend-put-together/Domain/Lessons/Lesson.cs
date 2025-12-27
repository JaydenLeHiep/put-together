namespace backend_put_together.Domain.Lessons;

public class Lesson
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Title { get; set; } = string.Empty;

    // Rich text HTML
    public string Content { get; set; } = string.Empty;
    
    public string VideoLibraryId { get; set; } = string.Empty;

    // Bunny video guid/id
    public string VideoGuid { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}