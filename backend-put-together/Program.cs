using backend_put_together.Extensions;
using Carter;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

#region Setup log
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();
builder.Host.UseSerilog();
#endregion

builder.Services
    .AddDatabase(builder.Configuration)
    .AddApplication()
    .AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapCarter();

app.MapGet("/", (ILogger<Program> logger) =>
{
    logger.LogInformation("Ok");
    
    return "OK";
});

app.Run();
