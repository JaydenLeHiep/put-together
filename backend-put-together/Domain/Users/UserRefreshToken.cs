namespace backend_put_together.Domain.Users;

public class UserRefreshToken
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public required string HashedToken { get; set; }
    public DateTime ExpiryTime { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? RevokedAt { get; set; }

    public User User { get; set; } = null!;
}