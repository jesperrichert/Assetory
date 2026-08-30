package config

import "github.com/gin-gonic/gin"

func NewGin() *gin.Engine {
	// gin.SetMode(gin.ReleaseMode)
	return gin.Default()
}
