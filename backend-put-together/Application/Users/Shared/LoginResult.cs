namespace backend_put_together.Application.Users.Shared;

public class LoginResult
{
    public bool Success { get; }
    public Guid? UserId { get; }


    private LoginResult(bool success, Guid? userId)
    {
        Success = success;
        UserId = userId;
    }

    public static LoginResult Fail()
        => new(false, null);

    public static LoginResult Ok(Guid userId)
        => new(true, userId);
}