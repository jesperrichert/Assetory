package util

import (
	"os"
)

func EnvToConfigValue[T any](key string, fallback T) T {
	var data any
	val, exists := os.LookupEnv(key)
	data = val
	if !exists {
		return fallback
	}
	t, _ := data.(T)
	return t
}
