# ---- Build stage ----
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copie sln + csproj
COPY CryptoDashboardApp.sln .
COPY CryptoDashboard.Domain/CryptoDashboard.Domain.csproj CryptoDashboard.Domain/
COPY CryptoDashboard.Application/CryptoDashboard.Application.csproj CryptoDashboard.Application/
COPY CryptoDashboard.Infrastructure/CryptoDashboard.Infrastructure.csproj CryptoDashboard.Infrastructure/
COPY CryptoDashboard.API/CryptoDashboard.API.csproj CryptoDashboard.API/

RUN dotnet restore CryptoDashboard.API/CryptoDashboard.API.csproj

COPY . .
RUN dotnet publish CryptoDashboard.API/CryptoDashboard.API.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:80

# Création d'un user non-root (pour des raisons de sécurité)
RUN adduser --disabled-password --gecos "" appuser
USER appuser

COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "CryptoDashboard.API.dll"]
