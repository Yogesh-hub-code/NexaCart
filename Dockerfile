# --- Stage 1: Build & Publish ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

ENV DOTNET_CLI_TELEMETRY_OPTOUT=1

COPY *.sln ./
COPY NexaCart.API/*.csproj ./NexaCart.API/
COPY NexaCart.Application/*.csproj ./NexaCart.Application/
COPY NexaCart.Domain/*.csproj ./NexaCart.Domain/
COPY NexaCart.Infrastructure/*.csproj ./NexaCart.Infrastructure/
COPY NexaCart.Shared/*.csproj ./NexaCart.Shared/

RUN dotnet restore NexaCart.API/NexaCart.API.csproj --disable-parallel

COPY . ./

RUN dotnet publish NexaCart.API/NexaCart.API.csproj -c Release -o /app/out -p:Parallel=false

# --- Stage 2: Runtime ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/out .

ENV PORT=8080
EXPOSE 8080

# Prevent inotify file watcher crash on Render
ENV DOTNET_USE_POLLING_FILE_WATCHER=false

ENTRYPOINT ["dotnet", "NexaCart.API.dll"]