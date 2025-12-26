using Npgsql;

namespace backend_put_together.Modules.DigitalOceanConnectionHelper;

public static class DigitalOceanConnectionHelper
{
    public static string BuildNpgsqlConnectionString(string raw)
    {
        // Already in Npgsql format → return directly
        if (raw.StartsWith("Host=", StringComparison.OrdinalIgnoreCase))
            return raw;

        // Parse DATABASE_URL
        var uri = new Uri(raw);
        var userInfo = uri.UserInfo.Split(':', 2);

        var builder = new Npgsql.NpgsqlConnectionStringBuilder
        {
            Host = uri.Host,
            Port = uri.Port,
            Username = userInfo[0],
            Password = userInfo[1],
            Database = uri.AbsolutePath.TrimStart('/'),
            SslMode = SslMode.Require,
            TrustServerCertificate = true
        };

        return builder.ConnectionString;
    }
}