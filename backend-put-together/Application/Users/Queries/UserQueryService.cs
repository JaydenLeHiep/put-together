using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend_put_together.Application.Users.DTOs;
using backend_put_together.Application.Users.Shared;
using backend_put_together.Domain.Users;
using backend_put_together.Infrastructure.Data;
using backend_put_together.Infrastructure.PasswordHasher;
using backend_put_together.Infrastructure.Tokens;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace backend_put_together.Application.Users.Queries;

public class UserQueryService : IUserQueryService
{
    private const int AmountDaysSaveRefreshToken = 7;
    private const int AmountOfMinuteAccessToken = 15;
    private const string LocalRegistrationProvider = "Local";
    private readonly ILogger<UserQueryService> _logger;
    private readonly AppDbContext _db;
    private readonly IAppPasswordHasher _appPasswordHasher;
    private readonly IConfiguration _config;

    public UserQueryService(ILogger<UserQueryService> logger, AppDbContext db, IAppPasswordHasher appPasswordHasher, IConfiguration config)
    {
        _logger = logger;
        _db = db;
        _appPasswordHasher = appPasswordHasher;
        _config = config;
    }

    public async Task<LoginResult> LoginAsync(LoginUserRequest req, CancellationToken ct)
    {
        var identifier = req.Identifier.Trim().ToLowerInvariant();

        var user = await _db.Users
            .Include(u => u.UserLogins)
            .FirstOrDefaultAsync(u =>
                    u.UserName.ToLower() == identifier ||
                    u.Email.ToLower() == identifier,
                ct);

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
        
        var generatedAccessToken = GenerateUserToken(user.Id, user.UserName, user.Role);
        var generatedRefreshToken = TokenHelper.GenerateRefreshToken();

        var userInfo = new UserInfo
        {
            Id = user.Id,
            UserName  = user.UserName,
            Email = user.Email,
            RoleName = ToRoleName(user.Role),
        };

        var refreshToken = new UserRefreshToken
        {
            UserId = user.Id,
            HashedToken = TokenHelper.HashRefreshToken(generatedRefreshToken),
            ExpiryTime =  DateTime.UtcNow.AddDays(AmountDaysSaveRefreshToken),
            CreatedAt = DateTime.UtcNow,
            RevokedAt = null
        };
        
        _db.UserRefreshTokens.Add(refreshToken);
        await _db.SaveChangesAsync(ct);

        return LoginResult.Ok(userInfo, generatedAccessToken,  generatedRefreshToken);
    }

    public async Task<RefreshResult> RefreshAsync(
        string refreshToken,
        CancellationToken ct)
    {
        
        var hashedToken = TokenHelper.HashRefreshToken(refreshToken);
        
        var storedToken = await _db.UserRefreshTokens
            .Include(rt => rt.User)
            .SingleOrDefaultAsync(rt => rt.HashedToken == hashedToken, ct);

        if (storedToken == null)
            return RefreshResult.Fail();

        if (storedToken.ExpiryTime <= DateTime.UtcNow)
        {
            storedToken.RevokedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync(ct);
            return RefreshResult.Fail();
        }
        
        var user = storedToken.User;
        
        var newAccessToken = GenerateUserToken(
            user.Id,
            user.UserName,
            user.Role);

        // Rotate refresh token
        var newRefreshToken = TokenHelper.GenerateRefreshToken();

        _db.UserRefreshTokens.Add(new UserRefreshToken
        {
            UserId = storedToken.UserId,
            HashedToken = TokenHelper.HashRefreshToken(newRefreshToken),
            CreatedAt = DateTime.UtcNow,
            ExpiryTime = DateTime.UtcNow.AddDays(AmountDaysSaveRefreshToken)
        });

        await _db.SaveChangesAsync(ct);

        return RefreshResult.Ok(
            newAccessToken,
            newRefreshToken
        );
    }

    public async Task LogoutAsync(string refreshToken, CancellationToken ct)
    {
        var hashedToken = TokenHelper.HashRefreshToken(refreshToken);

        await _db.UserRefreshTokens
            .Where(rt => rt.HashedToken == hashedToken && rt.RevokedAt == null)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(
                    rt => rt.RevokedAt,
                    DateTime.UtcNow),
                ct);
    }

    private string GenerateUserToken(Guid userId,string username, Role userRole)
    {
        var jwtSettings = _config.GetSection("Jwt");

        var key = jwtSettings["Key"];

        if (key == null)
        {
            _logger.LogError("JWT key missing");
            throw new InvalidOperationException("JWT key missing");
        }

        var issuer = jwtSettings["Issuer"];
        var audience = jwtSettings["Audience"];
        var expires = AmountOfMinuteAccessToken;

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, username),
            new Claim(ClaimTypes.Role, userRole.ToString())
        };

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

        var accessToken = new JwtSecurityToken(
            issuer,
            audience,
            claims,
            expires: DateTime.UtcNow.AddMinutes(expires),
            signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(accessToken);
    }

    private string ToRoleName(Role role)
    {
        return role.ToString();
    }
}