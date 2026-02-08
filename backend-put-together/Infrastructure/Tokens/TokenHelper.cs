using System.Security.Cryptography;
using System.Text;

namespace backend_put_together.Infrastructure.Tokens;

public static class TokenHelper
{
    private static readonly string RefreshTokenKey = "refreshToken";
    private static readonly string ProductionEnvironment = "Production";
    private const int AmountDaysSaveRefreshToken = 7;
    public static string GenerateRefreshToken()
    {
        var randomBytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(randomBytes);
    }
    public static string HashRefreshToken(string refreshToken)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(refreshToken);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    public static void  SendRefreshTokenInCookie(string refreshToken, IWebHostEnvironment env, HttpContext httpContext)
    {
        if (env.EnvironmentName == ProductionEnvironment)
        {
            httpContext.Response.Cookies.Append(
                RefreshTokenKey,
                refreshToken,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Path = "/",
                    MaxAge = TimeSpan.FromDays(AmountDaysSaveRefreshToken)
                }
            );
        }
        else
        {
            httpContext.Response.Cookies.Append(
                RefreshTokenKey,
                refreshToken,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false,
                    SameSite = SameSiteMode.Strict,
                    Path = "/",
                    MaxAge = TimeSpan.FromDays(AmountDaysSaveRefreshToken)
                }
            );
        }
    }

    public static void DeleteRefreshTokenInCookie(
        IWebHostEnvironment env,
        HttpContext httpContext)
    {
        var options = new CookieOptions
        {
            HttpOnly = true,
            Path = "/", 
        };

        if (env.IsProduction())
        {
            options.Secure = true;
            options.SameSite = SameSiteMode.None; 
        }
        else
        {
            options.Secure = false;              
            options.SameSite = SameSiteMode.Lax; 
        }

        httpContext.Response.Cookies.Delete(RefreshTokenKey, options);
    }
}