package correlation

import (
	"log"
	"net/http"
)

// Middleware garante que toda requisição tenha um correlation id.
// Ele também o injeta no contexto e reflete no header da resposta.
func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := GetOrCreate(r)
		w.Header().Set(Header, id)
		ctx := WithContext(r.Context(), id)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// Logger inclui o correlation id nos logs por requisição.
func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id, _ := FromContext(r.Context())
		log.Printf("method=%s path=%s corr=%s", r.Method, r.URL.Path, id)
		next.ServeHTTP(w, r)
	})
}
