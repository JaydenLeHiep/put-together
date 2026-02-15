using backend_put_together.Application.Users.DTOs;
using backend_put_together.Application.Users.Shared;

namespace backend_put_together.Application.Users.Queries;

public interface IUserQueryService
{
    Task<LoginResult> LoginAsync(LoginUserRequest req, CancellationToken ct);
    Task<RefreshResult> RefreshAsync(string refreshToken, CancellationToken ct);
    Task LogoutAsync(string refreshToken, CancellationToken ct);
    Task<IReadOnlyList<UserReadDto>> GetAllUsersAsync(CancellationToken ct = default);
    Task<IReadOnlyList<UserReadDto>> GetUsersByRoleAsync(string role, CancellationToken ct = default);
    Task<UserDetailsDto?> GetUserByIdAsync(Guid id, CancellationToken ct = default);
}