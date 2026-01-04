namespace backend_put_together.Infrastructure.Video.Bunny;

public sealed class BunnyOptions
{
    public string ApiKey { get; set; } = null!;
    public string DefaultLibraryId { get; set; } = null!;
    public string ApiBaseUrl { get; set; } = "https://video.bunnycdn.com";
    public string PullZone { get; set; } = "video.bunnycdn.com";
}