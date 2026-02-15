namespace backend_put_together.Application.Users.DTOs;

public sealed record UserDetailsDto(
    Guid Id,
    string UserName,
    string Email,
    string RoleName,
    DateTime CreatedAt,
    DateTime? DeletedAt,
    bool IsActive
);