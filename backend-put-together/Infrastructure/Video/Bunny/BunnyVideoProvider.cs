using System.Net.Http.Headers;
using System.Text.Json;
using backend_put_together.Infrastructure.Video;
using Microsoft.Extensions.Options;

namespace backend_put_together.Infrastructure.Video.Bunny;

public sealed class BunnyVideoProvider : IVideoProvider
{
    private readonly HttpClient _http;
    private readonly BunnyOptions _options;

    public BunnyVideoProvider(HttpClient http, IOptions<BunnyOptions> options)
    {
        _http = http;
        _options = options.Value;
    }

    public async Task<UploadVideoResult> UploadAsync(
        VideoUploadRequest request,
        CancellationToken ct = default)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentNullException.ThrowIfNull(request.Stream);

        if (string.IsNullOrWhiteSpace(request.LibraryId))
            throw new ArgumentException("LibraryId required");

        if (string.IsNullOrWhiteSpace(request.StreamApiKey))
            throw new ArgumentException("StreamApiKey required");

        var libraryId = request.LibraryId;
        var streamKey = request.StreamApiKey;

        var fileName = request.FileName;

        // ============================
        // STEP 1: Create video
        // ============================

        using var createReq = new HttpRequestMessage(
            HttpMethod.Post,
            $"{_options.StreamBaseUrl}/library/{libraryId}/videos"
        );

        createReq.Headers.TryAddWithoutValidation("AccessKey", streamKey);

        object payload = string.IsNullOrWhiteSpace(request.CollectionId)
            ? new { title = fileName }
            : new { title = fileName, collectionId = request.CollectionId };

        createReq.Content = JsonContent.Create(payload);

        using var createRes = await _http.SendAsync(createReq, ct);

        if (!createRes.IsSuccessStatusCode)
        {
            var body = await createRes.Content.ReadAsStringAsync(ct);

            throw new InvalidOperationException(
                $"Bunny create video failed. Status={(int)createRes.StatusCode} Body={body}");
        }

        var createJson = await createRes.Content.ReadAsStringAsync(ct);

        var videoGuid = JsonDocument
            .Parse(createJson)
            .RootElement
            .GetProperty("guid")
            .GetString()
            ?? throw new InvalidOperationException("Bunny did not return video guid");

        // ============================
        // STEP 2: Upload binary
        // ============================

        using var uploadReq = new HttpRequestMessage(
            HttpMethod.Put,
            $"{_options.StreamBaseUrl}/library/{libraryId}/videos/{videoGuid}"
        );

        uploadReq.Headers.TryAddWithoutValidation("AccessKey", streamKey);

        var streamContent = new StreamContent(request.Stream);
        streamContent.Headers.ContentType =
            new MediaTypeHeaderValue("application/octet-stream");

        uploadReq.Content = streamContent;

        using var uploadRes = await _http.SendAsync(uploadReq, ct);
        uploadRes.EnsureSuccessStatusCode();

        // ============================
        // RESULT
        // ============================

        var playbackUrl =
            $"https://iframe.mediadelivery.net/embed/{libraryId}/{videoGuid}";

        return new UploadVideoResult(
            libraryId,
            videoGuid,
            playbackUrl
        );
    }

    public async Task DeleteAsync(
        string videoLibraryId,
        string videoGuid,
        string streamApiKey,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(videoLibraryId))
            throw new ArgumentException(nameof(videoLibraryId));

        if (string.IsNullOrWhiteSpace(videoGuid))
            throw new ArgumentException(nameof(videoGuid));

        if (string.IsNullOrWhiteSpace(streamApiKey))
            throw new ArgumentException(nameof(streamApiKey));

        var url =
            $"{_options.StreamBaseUrl}/library/{videoLibraryId}/videos/{videoGuid}";

        using var req = new HttpRequestMessage(HttpMethod.Delete, url);
        req.Headers.TryAddWithoutValidation("AccessKey", streamApiKey);

        using var res = await _http.SendAsync(req, ct);

        if (!res.IsSuccessStatusCode)
        {
            var body = await res.Content.ReadAsStringAsync(ct);

            throw new InvalidOperationException(
                $"Bunny delete failed. Status={(int)res.StatusCode} Body={body}");
        }
    }
}