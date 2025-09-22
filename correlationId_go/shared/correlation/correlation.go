package correlation

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"strings"
)

const Header = "X-Correlation-Id"

type ctxKey struct{}

func FromContext(ctx context.Context) (string, bool) {
	v := ctx.Value(ctxKey{})
	if v == nil {
		return "", false
	}
	s, _ := v.(string)
	return s, s != ""
}

func WithContext(ctx context.Context, id string) context.Context {
	return context.WithValue(ctx, ctxKey{}, id)
}

func newID() string {
	var b [16]byte
	_, _ = rand.Read(b[:])
	b[6] = (b[6] & 0x0f) | 0x40
	b[8] = (b[8] & 0x3f) | 0x80
	hexed := hex.EncodeToString(b[:])
	return strings.Join([]string{
		hexed[0:8], hexed[8:12], hexed[12:16], hexed[16:20], hexed[20:32],
	}, "-")
}

// GetOrCreate retorna o header se presente; senão gera um novo.
func GetOrCreate(r *http.Request) string {
	id := strings.TrimSpace(r.Header.Get(Header))
	if id == "" {
		id = newID()
	}
	return id
}

// Inject seta o header de correlação em requisições de saída.
func Inject(req *http.Request, id string) {
	if id != "" {
		req.Header.Set(Header, id)
	}
}
