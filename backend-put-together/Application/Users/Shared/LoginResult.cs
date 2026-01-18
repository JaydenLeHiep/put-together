namespace backend_put_together.Application.Users.Shared;

public class LoginResult
{
    public bool Success { get; }
    public UserInfo? UserInfo { get; }
    
    public string? AccessToken { get; }
    public string? RefreshToken { get; }


    private LoginResult(bool success, UserInfo? user, string? accessToken, string? refreshToken)
    {
        Success = success;
        UserInfo = user;
        AccessToken = accessToken;
        RefreshToken = refreshToken;
    }

    public static LoginResult Fail()
        => new(false, null, null, null);

    public static LoginResult Ok(UserInfo userInfo, string? accessToken, string? refreshToken)
        => new(true, userInfo, accessToken, refreshToken);
}
