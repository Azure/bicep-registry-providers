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
    curl -X POST http://localhost:8080/endpoints/Save \
      -H 'Content-Type: application/json' \
      -d '{"import":{"provider":"foo", "version":"1.0"}, "resource": {"type":"myRes@v1", "properties": {"url": "www.microsoft.com"}}}'