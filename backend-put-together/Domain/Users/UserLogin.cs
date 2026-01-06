namespace backend_put_together.Domain.Users;

public class UserLogin
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public required string Provider { get; set; } // Local, Google, etc...
    public string? ProviderKey { get; set; }
    public string? HashedPassword { get; set; }
    public DateTime CreatedAt { get; set; }
    public User User { get; set; } = null!;
}