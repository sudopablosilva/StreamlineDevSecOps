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

	mux := http.NewServeMux()
	mux.HandleFunc("/final", func(w http.ResponseWriter, r *http.Request) {
		corr, _ := correlation.FromContext(r.Context())
		log.Printf("svc-b /final handler started, method=%s, corr=%s", r.Method, corr)
		
		if r.Method != http.MethodPost {
			log.Printf("svc-b method not allowed: %s, corr=%s", r.Method, corr)
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		
		log.Printf("svc-b /final handler completed successfully, corr=%s", corr)
		fmt.Fprintf(w, "svc-b ok (corr=%s)\n", corr)
	})

	handler := correlation.Middleware(correlation.Logger(mux))

	srv := &http.Server{
		Addr:         addr,
		Handler:      handler,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	log.Printf("svc-b listening on %s", addr)
	log.Fatal(srv.ListenAndServe())
}

func getenv(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}
