using backend_put_together.Extensions;
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

// Services
builder.Services
    .AddEndpointsApiExplorer()
    .AddSwaggerGen()
    .AddDatabase(builder.Configuration)
    .AddApplication()
    .AddCors(builder.Configuration)
    .AddJwt(builder.Configuration, builder.Environment)
    .AddAuthorizationPolicy();

// Bunny configuration
builder.Services.Configure<BunnyOptions>(
    builder.Configuration.GetSection("Bunny")
);
builder.Services.AddHttpClient();

var app = builder.Build();

// Reverse proxy / HTTPS support
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto
});

app.UseHttpsRedirection();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(CorsExtension.PolicyName);

app.UseAuthentication();
app.UseAuthorization();

app.MapCarter();

app.MapGet("/", (ILogger<Program> logger) =>
{
    logger.LogInformation("OK!");
    return "OK";
});

app.MapGet("/test-jwt", (ILogger<Program> logger) =>
    {
        logger.LogInformation("Test JWT!");
        return "Test JWT";
    })
    .RequireAuthorization("AdminOnly");

app.Run();