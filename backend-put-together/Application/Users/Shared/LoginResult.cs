namespace backend_put_together.Application.Users.Shared;

public class LoginResult
{
    public bool Success { get; }
    public bool NotVerified { get; }
    public UserInfo? UserInfo { get; }
    
    public string? AccessToken { get; }
    public string? RefreshToken { get; }
    
    
    
    private LoginResult(bool success,bool notVerified, UserInfo? user, string? accessToken, string? refreshToken)
    {
        Success = success;
        UserInfo = user;
        AccessToken = accessToken;
        RefreshToken = refreshToken;
        NotVerified = notVerified;
    }

    public static LoginResult Fail()
        => new(false, false, null, null, null);

    public static LoginResult NotVerifiedUser()
        => new(false, true, null, null, null);

    public static LoginResult Ok(
        UserInfo userInfo,
        string accessToken,
        string refreshToken)
        => new(true, false, userInfo, accessToken, refreshToken);
}
