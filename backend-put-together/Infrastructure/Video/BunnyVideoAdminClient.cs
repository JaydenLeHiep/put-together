using System.Net.Http.Json;
using Microsoft.Extensions.Options;
using backend_put_together.Modules.Bunny;

namespace backend_put_together.Infrastructure.Video;

public sealed class BunnyVideoAdminClient
{
    private readonly HttpClient _http;
    private readonly BunnyOptions _options;

    public BunnyVideoAdminClient(HttpClient http, IOptions<BunnyOptions> options)
    {
        _http = http;
        _options = options.Value;
    }

    public async Task<IReadOnlyList<string>> GetAllVideoGuidsAsync(
        string libraryId,
        CancellationToken ct)
    {
        var req = new HttpRequestMessage(
            HttpMethod.Get,
            $"{_options.ApiBaseUrl}/library/{libraryId}/videos");

        req.Headers.Add("AccessKey", _options.ApiKey);

        var res = await _http.SendAsync(req, ct);
        res.EnsureSuccessStatusCode();

        var json = await res.Content.ReadFromJsonAsync<BunnyVideoList>(ct);

        return json?.Items.Select(x => x.Guid).ToList()
               ?? [];
    }

    private sealed record BunnyVideoList(List<BunnyVideoItem> Items);
    private sealed record BunnyVideoItem(string Guid);
}