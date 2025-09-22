package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"example/shared/correlation"
)

func main() {
	addr := getenv("ADDR", ":8080")
	svcBURL := getenv("SVC_B_URL", "http://svc-b:8080/final")

	mux := http.NewServeMux()
	mux.HandleFunc("/work", func(w http.ResponseWriter, r *http.Request) {
		corr, _ := correlation.FromContext(r.Context())
		log.Printf("svc-a /work handler started, corr=%s, calling svc-b at %s", corr, svcBURL)

		req, err := http.NewRequestWithContext(r.Context(), http.MethodPost, svcBURL, nil)
		if err != nil {
			log.Printf("failed to create request to svc-b: %v, corr=%s", err, corr)
			http.Error(w, "failed to create request: "+err.Error(), http.StatusInternalServerError)
			return
		}
		correlation.Inject(req, corr)

		client := &http.Client{Timeout: 5 * time.Second}
		resp, err := client.Do(req)
		if err != nil {
			log.Printf("svc-b request failed: %v, corr=%s, url=%s", err, corr, svcBURL)
			http.Error(w, "svc-b error: "+err.Error(), http.StatusBadGateway)
			return
		}
		log.Printf("svc-b responded with status %d, corr=%s", resp.StatusCode, corr)
		resp.Body.Close()

		log.Printf("svc-a /work handler completed successfully, corr=%s", corr)
		fmt.Fprintf(w, "svc-a done (corr=%s)\n", corr)
	})

	handler := correlation.Middleware(correlation.Logger(mux))

	srv := &http.Server{
		Addr:         addr,
		Handler:      handler,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	log.Printf("svc-a listening on %s, svc-b URL: %s", addr, svcBURL)
	log.Fatal(srv.ListenAndServe())
}

func getenv(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}
