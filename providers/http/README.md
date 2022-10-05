# GitHub extensibility provider

## Testing locally
1. Open in Codespaces
1. Build: 
    ```sh
    docker build -t http:latest ./server/
    ```
1. Run: 
    ```sh
    docker run -p 8080:8080 http:latest
    ```
1. Test:
    ```sh
    curl -X POST http://localhost:8080/save \
      -H 'Content-Type: application/json' \
      -d '{"import":{"provider":"http", "version":"v1"}, "resource": {"type":"request@v1", "properties": {"uri": "https://api.weather.gov/gridpoints/SEW/131,69/forecast", "format": "json"}}}'