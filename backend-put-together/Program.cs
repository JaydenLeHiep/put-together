using backend_put_together.Extensions;
using backend_put_together.Modules.Video;
using backend_put_together.Modules.Bunny;
using Carter;
using Serilog;
using Microsoft.AspNetCore.Http.Features;

var builder = WebApplication.CreateBuilder(args);

// =========================
// Logging
// =========================
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();
builder.Host.UseSerilog();

// =========================
// Large file upload support
// =========================
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = long.MaxValue;
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartHeadersLengthLimit = int.MaxValue;
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = long.MaxValue;
});

// =========================
// Server config
// =========================
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// =========================
// Swagger
// =========================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// =========================
// App services
// =========================
builder.Services
    .AddDatabase(builder.Configuration)
    .AddApplication();

// Bunny
builder.Services.Configure<BunnyOptions>(builder.Configuration.GetSection("Bunny"));
builder.Services.AddHttpClient();

// Video abstraction
builder.Services.AddScoped<IVideoProvider, BunnyVideoProvider>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapCarter();

app.MapGet("/", (ILogger<Program> logger) =>
{
    logger.LogInformation("Ok");
    return "OK";
});

app.Run();