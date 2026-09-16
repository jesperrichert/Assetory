package util

import (
	"gorm.io/gorm"
	"jespersen.zip.assetory/internal/model"
)

func GetAPIAccess(db gorm.DB, sessionId string) model.APIAccess {
	var apiAccess model.APIAccess
	db.Where("token = ?", sessionId).Preload("User").First(&apiAccess)
	return apiAccess
}
