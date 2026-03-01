using backend_put_together.Domain.Lessons;

namespace backend_put_together.Domain.Storage;

public class S3StoredFile
{
    public Guid Id { get; set; }
    public required string FileName { get; set; }
    public required string S3Key { get; set; }
    public Guid LessonId { get; set; }
    
    public DateTime CreatedAt { get; set; } 
    public DateTime? UpdatedAt { get; set; }
    
    public DateTime? DeletedAt { get; set; }
    
    public Lesson Lesson { get; set; } = null!;
}