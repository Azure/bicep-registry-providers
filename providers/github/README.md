# GitHub extensibility provider

## Testing locally
1. Open in Codespaces
1. Build: 
    ```sh
    docker build -t github:latest ./server/
    ```
1. Run: 
    ```sh
    docker run -p 8080:8080 github:latest
    ```
1. Test:
    ```sh
    curl -X POST http://localhost:8080/save \
      -H 'Content-Type: application/json' \
      -d '{"import":{"provider":"github","version":"v1","config":{"accessToken":"..."}},"resource":{"type":"repositories@v1","properties":{}}}'