using System.Net.Http.Json;

namespace backend_put_together.Infrastructure.Video.Bunny;

public sealed class BunnyVideoAdminClient
{
    private readonly HttpClient _http;

    public BunnyVideoAdminClient(HttpClient http)
    {
        _http = http;
    }

    public async Task<IReadOnlyList<string>> GetAllVideoGuidsAsync(
        string libraryId,
        string streamApiKey,
        CancellationToken ct)
    {
        var request = new HttpRequestMessage(
            HttpMethod.Get,
            $"https://video.bunnycdn.com/library/{libraryId}/videos");

        request.Headers.Add("AccessKey", streamApiKey);

        var response = await _http.SendAsync(request, ct);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadFromJsonAsync<BunnyVideoList>(ct);

        return json?.Items.Select(x => x.Guid).ToList()
               ?? new List<string>();
    }

    private sealed record BunnyVideoList(List<BunnyVideoItem> Items);
    private sealed record BunnyVideoItem(string Guid);
}