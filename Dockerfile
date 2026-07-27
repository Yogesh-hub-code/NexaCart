# --- Stage 1: Build & Publish ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

ENV DOTNET_CLI_TELEMETRY_OPTOUT=1

# Copy solution file and project files first
COPY *.sln ./
COPY NexaCart.API/*.csproj ./NexaCart.API/
COPY NexaCart.Application/*.csproj ./NexaCart.Application/
COPY NexaCart.Domain/*.csproj ./NexaCart.Domain/
COPY NexaCart.Infrastructure/*.csproj ./NexaCart.Infrastructure/

# Restore dependencies for the API project sequentially
RUN dotnet restore NexaCart.API/NexaCart.API.csproj --disable-parallel

# Copy the rest of the source code
COPY . ./

# Publish Release binaries for NexaCart.API
RUN dotnet publish NexaCart.API/NexaCart.API.csproj -c Release -o /app/out --no-restore -p:Parallel=false

# --- Stage 2: Runtime ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/out .

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "NexaCart.API.dll"]