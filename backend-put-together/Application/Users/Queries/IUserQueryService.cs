using backend_put_together.Application.Users.DTOs;
using backend_put_together.Application.Users.Shared;

namespace backend_put_together.Application.Users.Queries;

public interface IUserQueryService
{
    Task<LoginResult> LoginAsync(LoginUserRequest req, CancellationToken ct);
}