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
	svcAURL := getenv("SVC_A_URL", "http://svc-a:8080/work")

	mux := http.NewServeMux()
	mux.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "ok")
	})

	mux.HandleFunc("/do", func(w http.ResponseWriter, r *http.Request) {
		corr, _ := correlation.FromContext(r.Context())
		log.Printf("gateway /do handler started, corr=%s, calling svc-a at %s", corr, svcAURL)

		req, err := http.NewRequestWithContext(r.Context(), http.MethodGet, svcAURL, nil)
		if err != nil {
			log.Printf("failed to create request to svc-a: %v, corr=%s", err, corr)
			http.Error(w, "failed to create request: "+err.Error(), http.StatusInternalServerError)
			return
		}
		correlation.Inject(req, corr)

		client := &http.Client{Timeout: 5 * time.Second}
		resp, err := client.Do(req)
		if err != nil {
			log.Printf("svc-a request failed: %v, corr=%s, url=%s", err, corr, svcAURL)
			http.Error(w, "svc-a error: "+err.Error(), http.StatusBadGateway)
			return
		}
		log.Printf("svc-a responded with status %d, corr=%s", resp.StatusCode, corr)
		defer resp.Body.Close()

		w.WriteHeader(resp.StatusCode)
		log.Printf("gateway /do handler completed successfully, corr=%s", corr)
		fmt.Fprintf(w, "gateway -> svc-a ok (corr=%s)\n", corr)
	})

	handler := correlation.Middleware(correlation.Logger(mux))

	srv := &http.Server{
		Addr:         addr,
		Handler:      handler,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	log.Printf("gateway listening on %s, svc-a URL: %s", addr, svcAURL)
	log.Fatal(srv.ListenAndServe())
}

func getenv(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}
