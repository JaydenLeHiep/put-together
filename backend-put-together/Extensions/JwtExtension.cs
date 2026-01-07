using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace backend_put_together.Extensions;

public static class JwtExtension
{
    public static IServiceCollection AddJwt(this IServiceCollection services, IConfiguration config, IWebHostEnvironment env)
    {
        var jwtSection = config.GetSection("Jwt");

        var key = jwtSection["Key"]
                  ?? throw new InvalidOperationException("Jwt:Key is missing");

        var issuer = jwtSection["Issuer"]
                     ?? throw new InvalidOperationException("Jwt:Issuer is missing");

        var audience = jwtSection["Audience"]
                       ?? throw new InvalidOperationException("Jwt:Audience is missing");

        var signingKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(key));
        
        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = !env.IsDevelopment();
                options.SaveToken = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = signingKey,

                    ValidateIssuer = true,
                    ValidIssuer = issuer,

                    ValidateAudience = true,
                    ValidAudience = audience,

                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });
        
        return services;
    }
}