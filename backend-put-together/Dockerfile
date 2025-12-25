# ---------- Build stage ----------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# copy csproj first for better layer caching
COPY backend-put-together.csproj ./
RUN dotnet restore backend-put-together.csproj

# copy the rest and publish
COPY . .
RUN dotnet publish -c Release -o /app/out

# ---------- Runtime stage ----------
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "backend-put-together.dll"]
