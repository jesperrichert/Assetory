package util

import (
	"slices"

	"gorm.io/gorm"
	"jespersen.zip.assetory/internal/model"
)

func Permission(db gorm.DB, session, permission string) (bool, *model.User) {
	var apiAccess model.APIAccess
	db.Where("token = ?", session).Preload("User").First(&apiAccess)
	if slices.Contains(apiAccess.Permissions, permission) || slices.Contains(apiAccess.Permissions, "*") {
		return true, apiAccess.User
	} else {
		return false, nil
	}
}
