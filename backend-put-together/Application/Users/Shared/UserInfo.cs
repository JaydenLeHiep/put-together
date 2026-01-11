namespace backend_put_together.Application.Users.Shared;

public class UserInfo
{
    public Guid? Id { get; set; }
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public string? RoleName { get; set; }
}