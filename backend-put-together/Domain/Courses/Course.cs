using backend_put_together.Domain.Lessons;

namespace backend_put_together.Domain.Courses;

public class Course
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty; // A1, A2, B1, etc.
    // Bunny Stream
    // Collection INSIDE the Category's Bunny Library
    public string BunnyCollectionId { get; set; } = string.Empty;
    // Category relationship (Category = Bunny Library)
    public Guid CategoryId { get; set; }
    public Category.Category Category { get; set; } = null!;
    public decimal? Price { get; set; }
    public bool IsPublished { get; set; }
    public Guid CreatedById { get; set; }
    
    // Audit
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Soft delete
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    
    // Navigation
    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
    
    // Domain behaviors
    public void Touch() => UpdatedAt = DateTime.UtcNow;
    public void SoftDelete()
    {
        IsDeleted = true;
        DeletedAt = DateTime.UtcNow;
    }
    public void Restore()
    {
        IsDeleted = false;
        DeletedAt = null;
    }
}