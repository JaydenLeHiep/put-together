namespace backend_put_together.Application.Users.Shared;

public class RefreshResult
{
    public bool Success { get; }
    public string? AccessToken { get; }
    public string? RefreshToken { get; }

    private RefreshResult(bool success, string? accessToken, string? refreshToken)
    {
        Success = success;
        AccessToken = accessToken;
        RefreshToken = refreshToken;
    }

    public static RefreshResult Fail()
        => new(false, null, null);

    public static RefreshResult Ok(string accessToken, string refreshToken)
        => new(true, accessToken, refreshToken);
}