using backend_put_together.Domain.Users;

namespace backend_put_together.Application.Users.Shared;

public class PasswordResetToken
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public required string TokenHash { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime ExpiresAt { get; set; }

    public DateTime? UsedAt { get; set; }

    public User User { get; set; } = null!;
}