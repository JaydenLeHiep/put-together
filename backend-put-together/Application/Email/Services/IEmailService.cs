namespace backend_put_together.Application.Email.Services;

public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string body);
}