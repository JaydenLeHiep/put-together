namespace backend_put_together.Domain.Access;

public class StudentCourseAccess
{
    public Guid StudentId { get; set; }
    public Guid CourseId { get; set; }

    public DateTime PurchasedAtUtc { get; set; }
    public DateTime ExpiresAtUtc { get; set; }

    public DateTime? RevokedAtUtc { get; set; }
}