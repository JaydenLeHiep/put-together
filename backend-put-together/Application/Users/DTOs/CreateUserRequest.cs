namespace backend_put_together.Application.User.DTOs;

public record CreateUserRequest(string UserName, string Email, string Password);