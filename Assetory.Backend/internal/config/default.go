package config

import (
	"fmt"
	"strings"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"jespersen.zip.assetory/internal/model"
	"jespersen.zip.assetory/internal/types/permissions"
)

func DefaultAdminAccountInit(db *gorm.DB) {
	uuid, _ := uuid.NewV7()
	password := strings.ReplaceAll(uuid.String(), "-", "")
	hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	var settings model.Settings
	db.First(&settings)
	if settings.HasDefaultAccount {
		return
	}

	user := model.User{
		UserName:    "admin",
		Password:    string(hash),
		IsOidc:      false,
		Permissions: permissions.AllTypes(),
	}
	db.Create(&user)
	settings.HasDefaultAccount = true
	db.Updates(&settings)

	fmt.Println("Default admin account created with username: admin password: ", password)
}
