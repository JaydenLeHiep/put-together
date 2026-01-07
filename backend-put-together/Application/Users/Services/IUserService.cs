using backend_put_together.Application.Users.DTOs;

namespace backend_put_together.Application.Users.Services;

public interface IUserService
{
    Task CreateAsync(
        CreateUserRequest request,
        CancellationToken ct = default);
}