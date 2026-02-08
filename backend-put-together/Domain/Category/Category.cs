using backend_put_together.Domain.Courses;

namespace backend_put_together.Domain.Category;

public class Category
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // Business
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    // Bunny Stream (1 Category = 1 Bunny Library)
    public string BunnyLibraryId { get; set; } = string.Empty;
    public string BunnyStreamApiKey { get; set; } = string.Empty;
    public string BunnyReadOnlyApiKey { get; set; } = string.Empty;

    // Audit
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Soft delete (recommended, matches your other entities)
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }

    // Navigation
    public ICollection<Course> Courses { get; set; } = new List<Course>();

    // Domain behavior
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