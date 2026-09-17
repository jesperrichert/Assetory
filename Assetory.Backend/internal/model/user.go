package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	UserName    string
	AccessToken string
	Password    string
	IsOidc      bool
	Permissions []string `gorm:"serializer:json"`
	APIAccess   *APIAccess
}
