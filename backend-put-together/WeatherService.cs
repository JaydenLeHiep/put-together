namespace backend_put_together;

public class WeatherService
{
    private readonly ILogger<WeatherService> _logger;
    
    public WeatherService(ILogger<WeatherService> logger)
    {
        _logger = logger;
    }

    public void DoSomething()
    {
        _logger.LogInformation("Service is doing something");
    }
}