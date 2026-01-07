namespace backend_put_together.Application.Users.Shared;

public class LoginResult
{
    public bool Success { get; }
    public Guid? UserId { get; }
    
    public string? AccessToken { get; }


    private LoginResult(bool success, Guid? userId, string? token)
    {
        Success = success;
        UserId = userId;
        AccessToken = token;
    }

    public static LoginResult Fail()
        => new(false, null, null);

    public static LoginResult Ok(Guid userId, string? token)
        => new(true, userId, token);
}