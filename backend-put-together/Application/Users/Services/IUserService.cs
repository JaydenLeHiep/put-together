using backend_put_together.Application.Users.DTOs;
using backend_put_together.Application.Users.Shared;

namespace backend_put_together.Application.Users.Services;

public interface IUserService
{
    Task CreateAsync(CreateUserRequest request, CancellationToken ct = default);
    Task<UpdateRoleResult> UpdateRoleStudentTeacherOnlyAsync(Guid userId, string role, CancellationToken ct);
    Task<bool> DeactivateAsync(Guid userId, CancellationToken ct);
    Task<bool> ActivateAsync(Guid userId, CancellationToken ct);
    Task<bool> ResetPasswordAsync(Guid userId, string newPassword, CancellationToken ct);
    Task<VerifyRegistrationEmailResult> VerifyRegistrationEmailAsync(string token, CancellationToken ct);
    Task<ResendVerificationResult> ResendVerificationEmailAsync(string email, CancellationToken ct);
}