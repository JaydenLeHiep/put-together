namespace backend_put_together.Application.Users.DTOs;

public sealed record UserReadDto(
    Guid Id,
    string UserName,
    string Email,
    string Role,
    DateTime CreatedAt
);