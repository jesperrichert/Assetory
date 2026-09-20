package model

import (
	"gorm.io/gorm"
)

type Settings struct {
	gorm.Model
	IsRegisterDisabled         bool
	HasDefaultAccount          bool
	IsOidcDisabled             bool
	IsOidcRegistrationDisabled bool
}
