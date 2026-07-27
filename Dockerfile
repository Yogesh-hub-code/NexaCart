# --- Stage 1: Build & Publish ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy all source files and publish Release build
COPY . ./
RUN dotnet publish -c Release -o /app/out

# --- Stage 2: Runtime ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy binaries from Stage 1
COPY --from=build /app/out .

# Dynamic port for Render
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "NexaCart.dll"]