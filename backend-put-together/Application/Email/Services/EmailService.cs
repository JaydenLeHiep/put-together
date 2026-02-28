using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;

namespace backend_put_together.Application.Email.Services;

public class EmailService : IEmailService
{
    private readonly IAmazonSimpleEmailService _ses;
    private readonly IConfiguration _config;

    public EmailService(IAmazonSimpleEmailService ses, IConfiguration config)
    {
        _ses = ses;
        _config = config;
    }
    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        var sourceEmail = _config["Email:SourceEmail"];
        var sendRequest = new SendEmailRequest
        {
            Source = sourceEmail,
            Destination = new Destination
            {
                ToAddresses = new List<string> { toEmail }
            },
            Message = new Message
            {
                Subject = new Content(subject),
                Body = new Body
                {
                    Html = new Content
                    {
                        Charset = "UTF-8",
                        Data = body
                    },
                    Text = new Content
                    {
                        Charset = "UTF-8",
                        Data = body
                    }
                }
            },
        };

        try
        {
            var response = await _ses.SendEmailAsync(sendRequest);
            Console.WriteLine(response);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"The email was not sent. Error message: {ex.Message}");
        }
    }
}