namespace backend_put_together.Application.Users.Shared;

public class VerifyRegistrationEmailResult
{
    public bool Success { get; }
    public string Message { get; }

    private VerifyRegistrationEmailResult(bool success, string message)
    {
        Success = success;
        Message = message;
    }

    public static VerifyRegistrationEmailResult Ok()
        => new(true, "Email verified successfully.");

    public static VerifyRegistrationEmailResult InvalidToken()
        => new(false, "Invalid verification link.");

    public static VerifyRegistrationEmailResult Expired()
        => new(false, "Verification link has expired.");

    public static VerifyRegistrationEmailResult AlreadyUsed()
        => new(false, "Verification link has already been used.");
}