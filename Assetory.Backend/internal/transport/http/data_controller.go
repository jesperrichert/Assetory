package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"jespersen.zip.assetory/internal/services"
	"jespersen.zip.assetory/internal/types/permissions"
	"jespersen.zip.assetory/internal/util"
)

type DataController struct {
	DB      *gorm.DB
	Service *services.DataService
}

func NewDataController(db *gorm.DB, service *services.DataService) *DataController {
	return &DataController{
		DB:      db,
		Service: service,
	}
}

func (c *DataController) Permissions(ctx *gin.Context) {
	isVaild, _ := util.Permission(*c.DB, util.GetSettionID(ctx), permissions.DataPermissions.Permission())
	if !isVaild {
		util.GenerateResponse(ctx, http.StatusUnauthorized, "No Session found.", true, nil)
		return
	}

	util.GenerateResponse(
		ctx,
		http.StatusOK,
		"PERMISSIONS_DATA",
		false,
		permissions.ToAllSettingTypes(),
	)
}
