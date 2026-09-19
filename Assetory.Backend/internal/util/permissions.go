package util

import (
	"slices"

	"gorm.io/gorm"
	"jespersen.zip.assetory/internal/model"
	"jespersen.zip.assetory/internal/types/permissions"
)

func Permission(db gorm.DB, session, permission string) (bool, *model.User) {
	var apiAccess model.APIAccess
	db.Where("token = ?", session).Preload("User").First(&apiAccess)
	if slices.Contains(apiAccess.Permissions, permission) || slices.Contains(apiAccess.Permissions, permissions.Star.Permission()) {
		return true, apiAccess.User
	} else {
		return false, nil
	}
}

func Permissions(db gorm.DB, session string, perms []string) (bool, *model.User) {
	var apiAccess model.APIAccess
	db.Where("token = ?", session).Preload("User").First(&apiAccess)
	if slices.Contains(apiAccess.Permissions, permissions.Star.Permission()) {
		return true, apiAccess.User
	}

	for _, p := range perms {
		if slices.Contains(apiAccess.Permissions, p) {
			return true, apiAccess.User
		}
	}

	return false, nil
}
