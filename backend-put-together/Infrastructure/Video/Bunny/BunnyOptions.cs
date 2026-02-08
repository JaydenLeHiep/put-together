namespace backend_put_together.Infrastructure.Video.Bunny;

public sealed class BunnyOptions
{
    public string AccessKey { get; set; } = null!;
    public string ApiBaseUrl { get; set; } = null!;
    public string StreamBaseUrl { get; set; } = null!;
    public string PullZone { get; set; } = null!;
}