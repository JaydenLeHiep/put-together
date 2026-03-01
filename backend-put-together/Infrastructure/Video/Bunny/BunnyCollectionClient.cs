using System.Net.Http.Json;
using System.Text.Json;

namespace backend_put_together.Infrastructure.Video.Bunny;

public sealed class BunnyCollectionClient
{
    private readonly HttpClient _http;

    public BunnyCollectionClient(HttpClient http)
    {
        _http = http;
    }

    /// <summary>
    /// Creates a new collection inside a specific Bunny library
    /// </summary>
    public async Task<string> CreateCollectionAsync(
        string libraryId,
        string streamApiKey,
        string collectionName,
        CancellationToken ct = default)
    {
        var url =
            $"https://video.bunnycdn.com/library/{libraryId}/collections";

        using var request = new HttpRequestMessage(HttpMethod.Post, url);
        request.Headers.Add("AccessKey", streamApiKey);
        request.Content = JsonContent.Create(new { name = collectionName });

        using var response = await _http.SendAsync(request, ct);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync(ct);
        var doc = JsonDocument.Parse(json);

        return doc.RootElement.GetProperty("guid").GetString()
               ?? throw new InvalidOperationException(
                   "Bunny did not return collection guid");
    }

    /// <summary>
    /// Adds video to collection
    /// </summary>
    public async Task AddVideoToCollectionAsync(
        string libraryId,
        string streamApiKey,
        string collectionId,
        string videoGuid,
        CancellationToken ct = default)
    {
        var url =
            $"https://video.bunnycdn.com/library/{libraryId}/videos/{videoGuid}/collections/{collectionId}";

        using var request = new HttpRequestMessage(HttpMethod.Put, url);
        request.Headers.Add("AccessKey", streamApiKey);

        using var response = await _http.SendAsync(request, ct);
        response.EnsureSuccessStatusCode();
    }

    /// <summary>
    /// Deletes collection but keeps videos
    /// </summary>
    public async Task DeleteCollectionAsync(
        string libraryId,
        string streamApiKey,
        string collectionId,
        CancellationToken ct = default)
    {
        var url =
            $"https://video.bunnycdn.com/library/{libraryId}/collections/{collectionId}";

        using var request = new HttpRequestMessage(HttpMethod.Delete, url);
        request.Headers.Add("AccessKey", streamApiKey);

        using var response = await _http.SendAsync(request, ct);

        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(ct);

            throw new InvalidOperationException(
                $"Bunny collection delete failed. Status={(int)response.StatusCode} Body={body}");
        }
    }
}