package http

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"jespersen.zip.assetory/internal/services"
)

type ContentController struct {
	DB      *gorm.DB
	Service *services.ContentService
}

func NewContentController(db *gorm.DB, service *services.ContentService) *ContentController {
	return &ContentController{
		DB:      db,
		Service: service,
	}
}

func (c *DataController) Pass(ctx *gin.Context) {

}
