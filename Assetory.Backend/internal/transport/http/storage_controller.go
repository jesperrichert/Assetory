package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"jespersen.zip.assetory/internal/services"
	"jespersen.zip.assetory/internal/util"
)

type StorageController struct {
	DB      *gorm.DB
	Service *services.StorageService
}

func NewStorageController(db *gorm.DB, service *services.StorageService) *StorageController {
	return &StorageController{
		DB:      db,
		Service: service,
	}
}

// POST
func (e *StorageController) Post(ctx *gin.Context) {
	isVaild, _ := util.Permission(*e.DB, util.GetSettionID(ctx), "storage:post")
	if !isVaild {
		util.GenerateResponse(ctx, http.StatusUnauthorized, "No Session found.", true, nil)
		return
	}
	e.Service.WriteFile(ctx)
}

// GET
func (e *StorageController) FileRaw(ctx *gin.Context) {
	fileName := ctx.Param("fileName")
	e.Service.GetFile(ctx, fileName)
}

// GET
func (e *StorageController) Get(ctx *gin.Context) {
	isVaild, _ := util.Permission(*e.DB, util.GetSettionID(ctx), "storage:get")
	if !isVaild {
		util.GenerateResponse(ctx, http.StatusUnauthorized, "No Session found.", true, nil)
		return
	}
	fileName := ctx.Param("fileName")
	e.Service.GetFileInfo(ctx, fileName)
}

// DELETE
func (e *StorageController) Delete(ctx *gin.Context) {
	isVaild, _ := util.Permission(*e.DB, util.GetSettionID(ctx), "storage:delete")
	if !isVaild {
		util.GenerateResponse(ctx, http.StatusUnauthorized, "No Session found.", true, nil)
		return
	}
	fileName := ctx.Param("fileName")
	e.Service.DeleteFile(ctx, fileName)
}

// GET
func (e *StorageController) Discovery(ctx *gin.Context) {
	isVaild, _ := util.Permission(*e.DB, util.GetSettionID(ctx), "storage:discovery")
	if !isVaild {
		util.GenerateResponse(ctx, http.StatusUnauthorized, "No Session found.", true, nil)
		return
	}
	e.Service.Discovery(ctx)
}
