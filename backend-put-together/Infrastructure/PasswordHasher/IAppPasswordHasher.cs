using backend_put_together.Domain.Users;

namespace backend_put_together.Infrastructure.PasswordHasher;

public interface IAppPasswordHasher
{
    string HashPassword(User user, string password);
    bool VerifyHashedPassword(User user, string hashedPassword, string providedPassword);
}