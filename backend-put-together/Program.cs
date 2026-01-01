using backend_put_together.Extensions;
using backend_put_together.Modules.Video;
using backend_put_together.Modules.Bunny;
using Carter;
using Serilog;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

// Logging
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();
builder.Host.UseSerilog();

// Large file upload support
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

// Server config (DO compatible)
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS (LOCAL + PRODUCTION SAFE)
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendCors", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// App services
builder.Services
    .AddDatabase(builder.Configuration)
    .AddApplication();

// Bunny
builder.Services.Configure<BunnyOptions>(
    builder.Configuration.GetSection("Bunny")
);
builder.Services.AddHttpClient();

// Video abstraction
builder.Services.AddScoped<IVideoProvider, BunnyVideoProvider>();

var app = builder.Build();

// Proxy / HTTPS support 
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto
});

app.UseHttpsRedirection();

// Swagger (dev only)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Pipeline
app.UseCors("FrontendCors");
app.MapCarter();

// Health check
app.MapGet("/", (ILogger<Program> logger, IConfiguration config) =>
{
    var db = Environment.GetEnvironmentVariable("DATABASE_URL");
    logger.LogInformation("API OK – DB: {Db}", db is null ? "NOT SET" : "SET");
    return "OK";
});

app.Run();