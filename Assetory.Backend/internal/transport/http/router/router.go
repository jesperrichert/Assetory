package router

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"jespersen.zip.assetory/internal/env"
	"jespersen.zip.assetory/internal/transport/http"
	"jespersen.zip.assetory/internal/transport/http/middleware"
)

type RouterConfig struct {
	Config            *env.Config
	App               *gin.Engine
	DB                *gorm.DB
	AuthController    *http.AuthController
	StorageController *http.StorageController
	SetingsController *http.SetingsController
}

func (c *RouterConfig) Setup() {
	if c.App == nil {
		c.App = gin.Default()
	}

	authMiddleware := middleware.NewAuthMiddleware(c.DB)

	api := c.App.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.GET("/@me", authMiddleware.Handle, c.AuthController.Me)
			auth.POST("/login", c.AuthController.Login)
			auth.POST("/register", c.AuthController.Register)
			auth.GET("/oidc/callback", c.AuthController.Oidc)
			auth.GET("/oidc", c.AuthController.OidcConfig)
			auth.GET("/config", c.AuthController.Config)
		}

		api.POST("/settings", authMiddleware.Handle, c.SetingsController.Post)
		api.GET("/storage", authMiddleware.Handle, c.StorageController.Discovery)
		api.POST("/storage", authMiddleware.Handle, c.StorageController.Post)
		api.GET("/storage/:fileName", authMiddleware.Handle, c.StorageController.Get)
		// TODO: Add access permissions
		api.GET("/storage/:fileName/raw", c.StorageController.FileRaw)
		api.DELETE("/storage/:fileName", authMiddleware.Handle, c.StorageController.Delete)
	}

}
