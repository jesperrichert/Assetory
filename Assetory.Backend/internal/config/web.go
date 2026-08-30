package config

import (
	"os"

	"github.com/gin-gonic/gin"
)

func NewWeb(engine *gin.Engine) {
	engine.Static("/assets", os.Getenv("FRONTEND_BUILD")+"/client/assets")
	engine.StaticFile("/", os.Getenv("FRONTEND_BUILD")+"/client/index.html")
	engine.NoRoute(func(c *gin.Context) {
		c.File(os.Getenv("FRONTEND_BUILD") + "/client/index.html")
	})
}
