FROM golang:1.19-alpine as builder

WORKDIR /app/

COPY go.* ./
RUN go mod download

COPY . .
RUN go build -o ./build/server ./src

# FROM scratch
# COPY --from=builder /app/build/server /app/build/server

EXPOSE 8080
ENTRYPOINT [ "/app/build/server" ]