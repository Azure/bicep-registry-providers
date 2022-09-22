FROM golang:1.19-alpine as builder

WORKDIR /app/

COPY go.* ./
RUN go mod download

COPY . .
RUN go build -o ./build/server ./src

EXPOSE 8080
ENTRYPOINT [ "/app/build/server" ]