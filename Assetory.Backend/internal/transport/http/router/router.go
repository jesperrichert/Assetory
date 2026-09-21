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
	ActionsController *http.ActionsController
	DataController    *http.DataController
}

func (c *RouterConfig) Setup() {
	if c.App == nil {
		c.App = gin.Default()
	}

	sessionMiddleware := middleware.NewSessionMiddleware(c.DB)

	api := c.App.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.GET("/@me", sessionMiddleware.Handle, c.AuthController.Me)
			auth.POST("/login", c.AuthController.Login)
			auth.POST("/register", c.AuthController.Register)
			auth.GET("/oidc/callback", c.AuthController.Oidc)
			auth.GET("/oidc", c.AuthController.OidcConfig)
			auth.GET("/config", c.AuthController.Config)
		}

		api.POST("/actions", sessionMiddleware.Handle, c.ActionsController.Post)

		content := api.Group("/content")
		{
			content.POST("/", sessionMiddleware.Handle)
		}

		data := api.Group("/data")
		{
			data.GET("/permissions", sessionMiddleware.Handle, c.DataController.Permissions)
			data.GET("/auth", sessionMiddleware.Handle, c.DataController.AuthSettings)
			data.GET("/users", sessionMiddleware.Handle, c.DataController.Users)
			data.GET("/users/:userId/permissions", sessionMiddleware.Handle, c.DataController.UserPermissions)
		}

		storage := api.Group("/storage")
		{
			storage.GET("/", sessionMiddleware.Handle, c.StorageController.Discovery)
			storage.POST("/storage", sessionMiddleware.Handle, c.StorageController.Post)

			storage.GET("/storage/:fileName", sessionMiddleware.Handle, c.StorageController.Get)
			storage.GET("/storage/:fileName/raw", sessionMiddleware.Handle, c.StorageController.FileRaw)
			storage.DELETE("/storage/:fileName", sessionMiddleware.Handle, c.StorageController.Delete)
		}

	}

}
