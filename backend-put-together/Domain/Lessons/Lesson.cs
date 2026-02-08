using backend_put_together.Domain.Courses;

using backend_put_together.Domain.Storage;

namespace backend_put_together.Domain.Lessons;

public class Lesson
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    
    // Video
    public string? VideoLibraryId { get; set; } 
    public string? VideoGuid { get; set; }
    public string? BunnyCollectionId { get; set; }
    
    // Course relationship
    public Guid CourseId { get; set; }
    public Course Course { get; set; } = null!;
    
    public bool IsPublished { get; set; } // true = public
    public DateTime? PublishedAt { get; set; }
    
    // Author
    public Guid CreatedById { get; set; }
    
    // Audit
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Soft delete
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<S3StoredFile> StoredFiles { get; set; } = new List<S3StoredFile>();
    
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
    
    public void Publish(Guid actorId)
    {
        if (CreatedById != actorId)
            throw new InvalidOperationException("Only the lesson owner can publish this lesson.");

        IsPublished = true;
        PublishedAt = DateTime.UtcNow;
        Touch();
    }

    public void Unpublish(Guid actorId)
    {
        if (CreatedById != actorId)
            throw new InvalidOperationException("Only the lesson owner can unpublish this lesson.");

        IsPublished = false;
        Touch();
    }
}