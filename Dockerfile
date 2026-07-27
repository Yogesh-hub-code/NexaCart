# --- Stage 1: Build & Publish ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Disable telemetry to save overhead memory
ENV DOTNET_CLI_TELEMETRY_OPTOUT=1

# Copy project file and restore
COPY *.csproj ./
RUN dotnet restore --disable-parallel

# Copy remaining source code
COPY . ./

# Publish with low-memory build settings
RUN dotnet publish -c Release -o /app/out --no-restore -p:Parallel=false

# --- Stage 2: Runtime ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy built binaries from Stage 1
COPY --from=build /app/out .

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "NexaCart.dll"]