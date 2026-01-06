using backend_put_together.Application.Users.DTOs;
using backend_put_together.Application.Users.Shared;
using backend_put_together.Infrastructure.Data;
using backend_put_together.Infrastructure.PasswordHasher;
using Microsoft.EntityFrameworkCore;

namespace backend_put_together.Application.Users.Queries;

public class UserQueryService : IUserQueryService
{
    private const string LocalRegistrationProvider = "Local";
    private readonly ILogger<UserQueryService> _logger;
    private readonly AppDbContext _db;
    private readonly IAppPasswordHasher _appPasswordHasher;

    public UserQueryService(ILogger<UserQueryService> logger, AppDbContext db, IAppPasswordHasher appPasswordHasher)
    {
        _logger = logger;
        _db = db;
        _appPasswordHasher = appPasswordHasher;
    }

    public async Task<LoginResult> LoginAsync(LoginUserRequest req, CancellationToken ct)
    {
        var normalizedUsername = req.UserName.Trim();

        var user = await _db.Users
            .Include(u => u.UserLogins)
            .FirstOrDefaultAsync(u => u.UserName == normalizedUsername, ct);

        if (user == null)
            return LoginResult.Fail();

        var login = user.UserLogins.FirstOrDefault(l => l.Provider == LocalRegistrationProvider);

        if (login?.HashedPassword == null)
            return LoginResult.Fail();

        var resultUserVerify = _appPasswordHasher.VerifyHashedPassword(user, login.HashedPassword, req.Password);

        if (!resultUserVerify)
        {
            return LoginResult.Fail();
        }

        return LoginResult.Ok(user.Id);
    }
}