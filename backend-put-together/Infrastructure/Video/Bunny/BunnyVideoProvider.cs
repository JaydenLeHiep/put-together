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

        var libraryId = string.IsNullOrWhiteSpace(request.LibraryId)
            ? _options.DefaultLibraryId
            : request.LibraryId;
        
        if (string.IsNullOrWhiteSpace(libraryId))
        {
            throw new InvalidOperationException(
                "VideoLibraryId is missing and DefaultLibraryId is not configured.");
        }
        
        var fileName = request.FileName;

        // ============================
        // STEP 1: Create video
        // ============================
        using var createReq = new HttpRequestMessage(
            HttpMethod.Post,
            $"{_options.ApiBaseUrl}/library/{libraryId}/videos"
        );

        createReq.Headers.Add("AccessKey", _options.ApiKey);
        createReq.Content = JsonContent.Create(new
        {
            title = fileName
        });

        using var createRes = await _http.SendAsync(createReq, ct);
        createRes.EnsureSuccessStatusCode();

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
            $"{_options.ApiBaseUrl}/library/{libraryId}/videos/{videoGuid}"
        );

        uploadReq.Headers.Add("AccessKey", _options.ApiKey);

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
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(videoLibraryId))
            throw new ArgumentException("videoLibraryId is required", nameof(videoLibraryId));

        if (string.IsNullOrWhiteSpace(videoGuid))
            throw new ArgumentException("videoGuid is required", nameof(videoGuid));

        var url =
            $"{_options.ApiBaseUrl}/library/{videoLibraryId}/videos/{videoGuid}";

        using var req = new HttpRequestMessage(HttpMethod.Delete, url);
        req.Headers.Add("AccessKey", _options.ApiKey);

        using var res = await _http.SendAsync(req, ct);

        if (!res.IsSuccessStatusCode)
        {
            var body = await res.Content.ReadAsStringAsync(ct);
            throw new InvalidOperationException(
                $"Bunny delete failed. Status={(int)res.StatusCode} Body={body}");
        }
    }
}