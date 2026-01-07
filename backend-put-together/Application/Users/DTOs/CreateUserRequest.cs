namespace backend_put_together.Application.Users.DTOs;

public record CreateUserRequest(string UserName, string Email, string Password);