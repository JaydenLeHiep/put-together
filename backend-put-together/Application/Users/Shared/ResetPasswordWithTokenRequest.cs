namespace backend_put_together.Application.Users.Shared;

public record ResetPasswordWithTokenRequest(string Token, string NewPassword);