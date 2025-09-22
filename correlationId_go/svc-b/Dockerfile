FROM golang:1.22 AS build
WORKDIR /src
COPY go.mod ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app /src/svc-b

FROM gcr.io/distroless/base-debian12
WORKDIR /
COPY --from=build /app /app
USER nonroot:nonroot
ENTRYPOINT ["/app"]
