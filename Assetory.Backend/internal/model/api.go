package model

import "gorm.io/gorm"

type APIAccess struct {
	gorm.Model
	Token       string
	Permissions []string `gorm:"serializer:json"`
	UserId      int
	User        *User
}
