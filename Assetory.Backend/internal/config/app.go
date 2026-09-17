package config

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"jespersen.zip.assetory/internal/env"
	"jespersen.zip.assetory/internal/services"
	"jespersen.zip.assetory/internal/transport/http"
	"jespersen.zip.assetory/internal/transport/http/router"
)

type Appconfig struct {
	Config *env.Config
	App    *gin.Engine
	DB     *gorm.DB
}

func Build(config *Appconfig) {

	//Register Services
	authService := services.NewAuthService(config.DB, config.Config)
	storageService := services.NewStorageService(config.Config)
	settingsService := services.NewActionsService(config.DB, config.Config)
	dataService := services.NewDataService(config.DB, config.Config)

	//Register Controller
	authController := http.NewAuthController(config.DB, authService)
	storageController := http.NewStorageController(config.DB, storageService)
	settingsController := http.NewActionsController(config.DB, settingsService)
	dataController := http.NewDataController(config.DB, dataService)

	routeConfig := router.RouterConfig{
		App:               config.App,
		DB:                config.DB,
		AuthController:    authController,
		StorageController: storageController,
		ActionsController: settingsController,
		DataController:    dataController,
		Config:            config.Config,
	}

	routeConfig.Setup()
}
