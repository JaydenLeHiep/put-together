using System.Net.Http.Json;
using Microsoft.Extensions.Options;

namespace backend_put_together.Infrastructure.Video.Bunny;

public sealed class BunnyLibraryClient
{
    private readonly HttpClient _http;

    public BunnyLibraryClient(
        HttpClient http,
        IOptions<BunnyOptions> options)
    {
        _http = http;
        var opts = options.Value;

        // Control plane endpoint
        _http.BaseAddress = new Uri(opts.ApiBaseUrl);

        _http.DefaultRequestHeaders.TryAddWithoutValidation(
            "AccessKey",
            opts.AccessKey);
    }

    // =====================================================
    // CREATE LIBRARY
    // =====================================================
    public async Task<BunnyLibraryResult> CreateLibraryAsync(
        string name,
        CancellationToken ct = default)
    {
        var response = await _http.PostAsJsonAsync(
            "videolibrary",
            new
            {
                Name = name
            },
            ct);

        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<BunnyLibraryResult>(ct);

        if (result is null)
            throw new InvalidOperationException("Failed to create Bunny library.");

        return result;
    }

    // =====================================================
    // UPDATE LIBRARY NAME
    // =====================================================
    public async Task UpdateLibraryNameAsync(
        string libraryId,
        string newName,
        CancellationToken ct)
    {
        var response = await _http.PostAsJsonAsync(
            $"videolibrary/{libraryId}",
            new { Name = newName },
            ct);

        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(ct);

            throw new InvalidOperationException(
                $"Failed to update Bunny library {libraryId}: {body}");
        }
    }

    // =====================================================
    // DELETE LIBRARY
    // =====================================================
    public async Task DeleteLibraryAsync(
        string libraryId,
        CancellationToken ct)
    {
        var response = await _http.DeleteAsync(
            $"videolibrary/{libraryId}",
            ct);

        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(ct);

            throw new InvalidOperationException(
                $"Failed to delete Bunny library {libraryId}: {body}");
        }
    }
}