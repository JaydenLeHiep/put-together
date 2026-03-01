namespace backend_put_together.Application.Users.DTOs;

public enum UpdateRoleResult
{
    Success = 0,
    UserNotFound = 1,
    InvalidRole = 2,
    TargetIsAdmin = 3
}