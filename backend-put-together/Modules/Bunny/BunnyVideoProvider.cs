using System.Net.Http.Headers;
using System.Text.Json;
using backend_put_together.Modules.Video;
using Microsoft.Extensions.Options;

namespace backend_put_together.Modules.Bunny;

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
        Stream fileStream,
        string fileName,
        string? libraryId,
        CancellationToken ct)
    {
        var libId = libraryId ?? _options.DefaultLibraryId;

        // ----------------------------
        // STEP 1: Create video
        // ----------------------------
        var createReq = new HttpRequestMessage(
            HttpMethod.Post,
            $"{_options.ApiBaseUrl}/library/{libId}/videos"
        );

        createReq.Headers.Add("AccessKey", _options.ApiKey);
        createReq.Content = JsonContent.Create(new
        {
            title = fileName
        });

        var createRes = await _http.SendAsync(createReq, ct);
        createRes.EnsureSuccessStatusCode();

        var createJson = await createRes.Content.ReadAsStringAsync(ct);
        var videoGuid = JsonDocument.Parse(createJson)
            .RootElement
            .GetProperty("guid")
            .GetString()!;

        // ----------------------------
        // STEP 2: Upload binary
        // ----------------------------
        var uploadReq = new HttpRequestMessage(
            HttpMethod.Put,
            $"{_options.ApiBaseUrl}/library/{libId}/videos/{videoGuid}"
        );

        uploadReq.Headers.Add("AccessKey", _options.ApiKey);

        var streamContent = new StreamContent(fileStream);
        streamContent.Headers.ContentType =
            new MediaTypeHeaderValue("application/octet-stream");

        uploadReq.Content = streamContent;

        var uploadRes = await _http.SendAsync(uploadReq, ct);
        uploadRes.EnsureSuccessStatusCode();

        // ----------------------------
        // RESULT
        // ----------------------------
        var playbackUrl =
            $"https://iframe.mediadelivery.net/embed/{libId}/{videoGuid}";

        return new UploadVideoResult(
            libId,
            videoGuid,
            playbackUrl
        );
    }
}