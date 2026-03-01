namespace backend_put_together.Infrastructure.Video.Bunny;

public sealed class BunnyLibraryResult
{
    public long Id { get; set; }  

    public string ApiKey { get; set; } = string.Empty;
    public string ReadOnlyApiKey { get; set; } = string.Empty;
}