using System.Security.Cryptography;
using System.Text;
using backend_put_together.Application.Email.Services;
using backend_put_together.Application.Users.DTOs;
using backend_put_together.Application.Users.Shared;
using backend_put_together.Infrastructure.Data;
using backend_put_together.Infrastructure.PasswordHasher;
using backend_put_together.Domain.Users;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

namespace backend_put_together.Application.Users.Services;

public class UserService : IUserService
{
    private const string LocalRegistrationProvider = "Local";

    private readonly ILogger<UserService> _logger;
    private readonly AppDbContext _db;
    private readonly IAppPasswordHasher _appPasswordHasher;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _config;

    public UserService(ILogger<UserService> logger, AppDbContext db, IAppPasswordHasher appPasswordHasher, IEmailService emailService, IConfiguration config)
    {
        _logger = logger;
        _db = db;
        _appPasswordHasher = appPasswordHasher;
        _emailService = emailService;
        _config = config;
    }

    public async Task CreateAsync(CreateUserRequest request, CancellationToken ct = default)
    {
        await using var transaction = await _db.Database.BeginTransactionAsync(ct);
        try
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
            await _db.Users.AddAsync(newUser, ct);
            await _db.SaveChangesAsync(ct);
            

            var rawBytes = RandomNumberGenerator.GetBytes(32);
            var rawToken = WebEncoders.Base64UrlEncode(rawBytes);

            var tokenHash = Convert.ToBase64String(
                SHA256.HashData(rawBytes)
            );
            
            var verificationToken = new EmailVerificationToken
            {
                UserId = newUser.Id,
                TokenHash = tokenHash,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddHours(24)
            };
            
            await _db.EmailVerificationTokens.AddAsync(verificationToken, ct);
            await _db.SaveChangesAsync(ct);
            
            var frontendLink = _config["Email:FrontendLink"];
            var verificationLink =
                $"{frontendLink}/verify-email?token={Uri.EscapeDataString(rawToken)}";
            
            var htmlBody = $@"
                <h2>Verify your account</h2>
                <p>Thank you for registering.</p>
                <p>
                    Click the link below to verify your account:
                {verificationLink}
                </p>
                 <p><a href='{verificationLink}'>Verify Email</a></p>
                <p>This link will expire in 24 hours.</p>";


            await _emailService.SendEmailAsync(
                newUser.Email,
                "Verify your account",
                htmlBody
            );

            await transaction.CommitAsync(ct);
            
            _logger.LogInformation("User created: {0}", newUser.UserName);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            await transaction.RollbackAsync(ct);
            throw;
        }
        
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

    public async Task<VerifyRegistrationEmailResult> VerifyRegistrationEmailAsync(string token, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(token))
            return VerifyRegistrationEmailResult.InvalidToken();

        var rawBytes = WebEncoders.Base64UrlDecode(token);

        var tokenHash = Convert.ToBase64String(
            SHA256.HashData(rawBytes)
        );

        var verificationToken = await _db.EmailVerificationTokens
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.TokenHash == tokenHash, ct);

        if (verificationToken == null)
            return VerifyRegistrationEmailResult.InvalidToken();

        if (verificationToken.UsedAt != null)
            return VerifyRegistrationEmailResult.AlreadyUsed();

        if (verificationToken.ExpiresAt < DateTime.UtcNow)
            return VerifyRegistrationEmailResult.Expired();

        verificationToken.UsedAt = DateTime.UtcNow;
        verificationToken.User.EmailVerifiedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        return VerifyRegistrationEmailResult.Ok();
    }

    public async Task<ResendVerificationResult> ResendVerificationEmailAsync(string email, CancellationToken ct)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();

        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail, ct);

        if (user == null)
            return ResendVerificationResult.UserNotFound();

        if (user.EmailVerifiedAt != null)
            return ResendVerificationResult.AlreadyVerified();

        // Invalidate old unused tokens
        var oldTokens = await _db.EmailVerificationTokens
            .Where(t => t.UserId == user.Id && t.UsedAt == null)
            .ToListAsync(ct);

        foreach (var t in oldTokens)
        {
            t.UsedAt = DateTime.UtcNow;
        }
        
        var rawBytes = RandomNumberGenerator.GetBytes(32);
        var rawToken = WebEncoders.Base64UrlEncode(rawBytes);

        var tokenHash = Convert.ToBase64String(
            SHA256.HashData(rawBytes)
        );

        var verificationToken = new EmailVerificationToken
        {
            UserId = user.Id,
            TokenHash = tokenHash,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(24)
        };

        await _db.EmailVerificationTokens.AddAsync(verificationToken, ct);
        await _db.SaveChangesAsync(ct);

        var frontendLink = _config["Email:FrontendLink"];
        var verificationLink =
            $"{frontendLink}/verify-email?token={Uri.EscapeDataString(rawToken)}";

        var htmlBody = $@"
        <h2>Verify your account</h2>
        <p>Please click below to verify your email:</p>
        <p><a href='{verificationLink}'>Verify Email</a></p>
        <p>This link expires in 24 hours.</p>";

        await _emailService.SendEmailAsync(
            user.Email,
            "Resend verification email",
            htmlBody
        );

        return ResendVerificationResult.Ok();
    }

    public async Task ForgotPasswordAsync(string email, CancellationToken ct)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();

        var user = await _db.Users
            .Include(u => u.UserLogins)
            .FirstOrDefaultAsync(u =>
                    u.Email.ToLower() == normalizedEmail &&
                    u.DeletedAt == null,
                ct);
        
        if (user == null)
            return;
        
        var oldTokens = await _db.PasswordResetTokens
            .Where(t => t.UserId == user.Id && t.UsedAt == null)
            .ToListAsync(ct);

        foreach (var t in oldTokens)
            t.UsedAt = DateTime.UtcNow;
        
        var rawBytes = RandomNumberGenerator.GetBytes(32);
        var rawToken = WebEncoders.Base64UrlEncode(rawBytes);

        var tokenHash = Convert.ToBase64String(
            SHA256.HashData(rawBytes)
        );

        var resetToken = new PasswordResetToken
        {
            UserId = user.Id,
            TokenHash = tokenHash,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddMinutes(5)
        };

        await _db.PasswordResetTokens.AddAsync(resetToken, ct);
        await _db.SaveChangesAsync(ct);

        var frontendLink = _config["Email:FrontendLink"];
        var resetLink =
            $"{frontendLink}/reset-password?token={Uri.EscapeDataString(rawToken)}";

        var htmlBody = $@"
        <h2>Reset your password</h2>
        <p>You requested a password reset.</p>
        <p><a href='{resetLink}'>Reset Password</a></p>
        <p>This link expires in 5 minutes.</p>
        <p>If you did not request this, ignore this email.</p>";

        await _emailService.SendEmailAsync(
            user.Email,
            "Reset your password",
            htmlBody
        );
    }

    public async Task<bool> ResetPasswordWithTokenAsync(
        string token,
        string newPassword,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(token))
            return false;

        if (string.IsNullOrWhiteSpace(newPassword) || newPassword.Length < 8)
            return false;

        var rawBytes = WebEncoders.Base64UrlDecode(token);

        var tokenHash = Convert.ToBase64String(
            SHA256.HashData(rawBytes)
        );

        var resetToken = await _db.PasswordResetTokens
            .Include(t => t.User)
            .ThenInclude(u => u.UserLogins)
            .FirstOrDefaultAsync(t => t.TokenHash == tokenHash, ct);

        if (resetToken == null)
            return false;

        if (resetToken.UsedAt != null)
            return false;

        if (resetToken.ExpiresAt < DateTime.UtcNow)
            return false;

        var user = resetToken.User;

        var login = user.UserLogins
            .FirstOrDefault(l => l.Provider == LocalRegistrationProvider);

        if (login == null)
            return false;

        login.HashedPassword = _appPasswordHasher.HashPassword(user, newPassword);

        resetToken.UsedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        return true;
    }
}