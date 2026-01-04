using backend_put_together.Extensions;
using backend_put_together.Infrastructure.Video;
using backend_put_together.Infrastructure.Video.Bunny;
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

// Server config (DigitalOcean)
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS 
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendCors", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "https://octopus-app-r2mpa.ondigitalocean.app"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Application services
builder.Services
    .AddDatabase(builder.Configuration)
    .AddApplication();

// Bunny configuration
builder.Services.Configure<BunnyOptions>(
    builder.Configuration.GetSection("Bunny")
);
builder.Services.AddHttpClient();

// Video provider
builder.Services.AddScoped<IVideoProvider, BunnyVideoProvider>();

var app = builder.Build();

// Reverse proxy / HTTPS support
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto
});

app.UseHttpsRedirection();

// Swagger (development only)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware pipeline
app.UseCors("FrontendCors");
app.MapCarter();

// Health check
app.MapGet("/", (ILogger<Program> logger) =>
{
    var db = Environment.GetEnvironmentVariable("DATABASE_URL");
    logger.LogInformation(
        "API OK – DATABASE_URL: {DbState}",
        db is null ? "NOT SET" : "SET"
    );
    return "OK";
});

app.Run();