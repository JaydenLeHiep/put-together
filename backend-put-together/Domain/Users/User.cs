using backend_put_together.Application.Users.Shared;

namespace backend_put_together.Domain.Users;

public class User
{
    public Guid Id { get; set; }

    public required string UserName { get; set; }
    public required string Email { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public Role Role { get; set; }
    public ICollection<UserLogin> UserLogins { get; set; } = new List<UserLogin>();
    public ICollection<UserRefreshToken> UserRefreshTokens { get; set; } = new List<UserRefreshToken>();
}
