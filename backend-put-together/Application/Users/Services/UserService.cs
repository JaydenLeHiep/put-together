using backend_put_together.Application.Users.DTOs;
using backend_put_together.Application.Users.Shared;
using backend_put_together.Infrastructure.Data;
using backend_put_together.Infrastructure.PasswordHasher;
using backend_put_together.Domain.Users;

namespace backend_put_together.Application.Users.Services;

public class UserService : IUserService
{
    private const string LocalRegistrationProvider = "Local";

    private readonly ILogger<UserService> _logger;
    private readonly AppDbContext _db;
    private readonly IAppPasswordHasher _appPasswordHasher;

    public UserService(ILogger<UserService> logger, AppDbContext db, IAppPasswordHasher appPasswordHasher)
    {
        _logger = logger;
        _db = db;
        _appPasswordHasher = appPasswordHasher;
    }

    public async Task CreateAsync(CreateUserRequest request, CancellationToken ct = default)
    {
        var username = request.UserName;
        var email = request.Email;
        var password = request.Password;

        var newUser = new User
        {
            UserName = username,
            Email = email,
            Role = Role.Student,
            CreatedAt = DateTime.UtcNow,
            DeletedAt = null
        };

        var newUserLogin = new UserLogin
        {
            Provider = LocalRegistrationProvider,
            HashedPassword = _appPasswordHasher.HashPassword(newUser, password)
        };
        newUser.UserLogins.Add(newUserLogin);
        await _db.Users.AddAsync(newUser);
        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("User created: {0}", newUser.UserName);
    }
}