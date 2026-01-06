using backend_put_together.Domain.Users;
using Microsoft.AspNetCore.Identity;

namespace backend_put_together.Infrastructure.PasswordHasher;
public class AppPasswordHasher : IAppPasswordHasher
{
    private readonly PasswordHasher<User> _passwordHasher;
    
    public AppPasswordHasher(PasswordHasher<User> passwordHasher)
    {
        _passwordHasher = passwordHasher;
    }
    public string HashPassword(User user, string password)
    {
        var hashedPassword = _passwordHasher.HashPassword(user, password);
        return hashedPassword;
    }

    public bool VerifyHashedPassword(User user, string hashedPassword, string providedPassword)
    {
        var result = _passwordHasher.VerifyHashedPassword(user, hashedPassword, providedPassword);
        
        if(result == PasswordVerificationResult.Failed)
        {
            return false;
        }
        return true;
    }
}
