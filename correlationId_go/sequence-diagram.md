# Correlation ID Flow Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Gateway
    participant SvcA as Service A
    participant SvcB as Service B

    Client->>Gateway: GET /do
    Note over Gateway: Generate correlation ID
    Gateway->>Gateway: Log: gateway /do handler started
    
    Gateway->>SvcA: GET /work (with correlation ID)
    Note over SvcA: Extract correlation ID from headers
    SvcA->>SvcA: Log: svc-a /work handler started
    
    SvcA->>SvcB: POST /final (with correlation ID)
    Note over SvcB: Extract correlation ID from headers
    SvcB->>SvcB: Log: svc-b /final handler started
    SvcB->>SvcB: Process request
    SvcB->>SvcB: Log: svc-b /final handler completed
    SvcB-->>SvcA: 200 OK: svc-b ok (corr=ID)
    
    SvcA->>SvcA: Log: svc-a /work handler completed
    SvcA-->>Gateway: 200 OK: svc-a done (corr=ID)
    
    Gateway->>Gateway: Log: gateway /do handler completed
    Gateway-->>Client: 200 OK: gateway -> svc-a ok (corr=ID)
    
    Note over Client,SvcB: Same correlation ID flows through entire request chain
```

## Flow Description

1. **Client** makes GET request to `/do` endpoint
2. **Gateway** generates correlation ID and logs request start
3. **Gateway** forwards request to Service A with correlation ID in headers
4. **Service A** extracts correlation ID and logs request start
5. **Service A** makes POST request to Service B with same correlation ID
6. **Service B** processes request and responds with correlation ID
7. **Service A** responds to Gateway with correlation ID
8. **Gateway** responds to Client with correlation ID

## Debugging Points

- Each service logs when handlers start/complete
- Correlation ID is preserved throughout the entire chain
- HTTP status codes and errors are logged with correlation context
- Service URLs and configurations are logged at startup