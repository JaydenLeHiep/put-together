namespace backend_put_together.Application.Users.Shared;

public class ResendVerificationResult
{
    public bool Success { get; }
    public string Message { get; }

    private ResendVerificationResult(bool success, string message)
    {
        Success = success;
        Message = message;
    }

    public static ResendVerificationResult UserNotFound()
        => new(false, "User not found.");

    public static ResendVerificationResult AlreadyVerified()
        => new(false, "Email already verified.");

    public static ResendVerificationResult Ok()
        => new(true, "Verification email has been resent.");
}
