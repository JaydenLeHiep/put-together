using backend_put_together.Domain.Storage;

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
    
    // Audit
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Soft delete
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<S3StoredFile> StoredFiles { get; set; } = new List<S3StoredFile>();
    
    // Domain behaviors
    public void Touch()
    {
        UpdatedAt = DateTime.UtcNow;
    }

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