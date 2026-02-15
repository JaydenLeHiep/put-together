using backend_put_together.Application.Users.DTOs;
using backend_put_together.Application.Users.Shared;
using backend_put_together.Infrastructure.Data;
using backend_put_together.Infrastructure.PasswordHasher;
using backend_put_together.Domain.Users;
using Microsoft.EntityFrameworkCore;

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
    
    public async Task<UpdateRoleResult> UpdateRoleStudentTeacherOnlyAsync(
        Guid userId,
        string role,
        CancellationToken ct)
    {
        // Parse only Teacher/Student
        if (!Enum.TryParse<Role>(role, true, out var newRole))
            return UpdateRoleResult.InvalidRole;

        if (newRole != Role.Student && newRole != Role.Teacher)
            return UpdateRoleResult.InvalidRole;

        // Load target user
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Id == userId && u.DeletedAt == null, ct);

        if (user == null)
            return UpdateRoleResult.UserNotFound;

        // HARD RULE: cannot change Admin user role
        if (user.Role == Role.Admin)
            return UpdateRoleResult.TargetIsAdmin;

        // Only allow Student <-> Teacher transitions
        if (user.Role != Role.Student && user.Role != Role.Teacher)
            return UpdateRoleResult.InvalidRole;

        user.Role = newRole;
        await _db.SaveChangesAsync(ct);

        return UpdateRoleResult.Success;
    }
    
    public async Task<bool> DeactivateAsync(Guid userId, CancellationToken ct) //Soft Delete
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId, ct);
        if (user == null) return false;
        if (user.Role == Role.Admin) return false;

        user.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> ActivateAsync(Guid userId, CancellationToken ct)
    {
        var updated = await _db.Users
            .Where(u => u.Id == userId)
            .ExecuteUpdateAsync(setters => setters.SetProperty(u => u.DeletedAt, (DateTime?)null), ct);

        return updated > 0;
    }
    
    public async Task<bool> ResetPasswordAsync(Guid userId, string newPassword, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(newPassword) || newPassword.Length < 8) return false;

        var user = await _db.Users
            .Include(u => u.UserLogins)
            .FirstOrDefaultAsync(u => u.Id == userId && u.DeletedAt == null, ct);

        if (user == null) return false;

        var login = user.UserLogins.FirstOrDefault(l => l.Provider == LocalRegistrationProvider);
        if (login == null) return false;

        // hash new password
        var newHashed = _appPasswordHasher.HashPassword(user, newPassword);
        login.HashedPassword = newHashed;

        await _db.SaveChangesAsync(ct);
        return true;
    }
}