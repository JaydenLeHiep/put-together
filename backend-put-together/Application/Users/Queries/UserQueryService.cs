using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend_put_together.Application.Users.DTOs;
using backend_put_together.Application.Users.Shared;
using backend_put_together.Domain.Users;
using backend_put_together.Infrastructure.Data;
using backend_put_together.Infrastructure.PasswordHasher;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace backend_put_together.Application.Users.Queries;

public class UserQueryService : IUserQueryService
{
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
        
        var generatedToken = GenerateUserToken(user.Id, user.UserName, user.Role);

        return LoginResult.Ok(user.Id, generatedToken);
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
        var expires = double.Parse(jwtSettings["ExpiresInMinutes"] ?? string.Empty);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, username),
            new Claim(ClaimTypes.Role, userRole.ToString())
        };

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

        var token = new JwtSecurityToken(
            issuer,
            audience,
            claims,
            expires: DateTime.UtcNow.AddMinutes(expires),
            signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}