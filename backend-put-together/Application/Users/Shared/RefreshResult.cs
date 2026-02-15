namespace backend_put_together.Application.Users.Shared;

public class RefreshResult
{
    public bool Success { get; }
    public string? AccessToken { get; }
    public string? RefreshToken { get; }
    public UserInfo? UserInfo { get; }

    private RefreshResult(
        bool success,
        string? accessToken,
        string? refreshToken,
        UserInfo? userInfo)
    {
        Success = success;
        AccessToken = accessToken;
        RefreshToken = refreshToken;
        UserInfo = userInfo;
    }

    public static RefreshResult Fail()
        => new(false, null, null, null);

    public static RefreshResult Ok(
        string accessToken,
        string refreshToken,
        UserInfo userInfo)
        => new(true, accessToken, refreshToken, userInfo);
}