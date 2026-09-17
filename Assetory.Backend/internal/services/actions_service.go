package services

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"jespersen.zip.assetory/internal/dto"
	"jespersen.zip.assetory/internal/env"
	"jespersen.zip.assetory/internal/util"
)

type ActionsService struct {
	Config *env.Config
	DB     *gorm.DB
}

func NewActionsService(db *gorm.DB, config *env.Config) *ActionsService {
	return &ActionsService{
		Config: config,
		DB:     db,
	}
}

func (s *ActionsService) PasswordChange(ctx *gin.Context, oldPassword string, newPassword string) {
	sessionId := util.GetSettionID(ctx)
	apiAccess := util.GetAPIAccess(*s.DB, sessionId)

	err := bcrypt.CompareHashAndPassword([]byte(apiAccess.User.Password), []byte(oldPassword))
	if err != nil {
		util.GenerateResponse(
			ctx,
			http.StatusConflict,
			"INVALID_PASSWORD",
			true,
			nil,
		)
		return
	}
	if apiAccess.User.IsOidc {
		util.GenerateResponse(
			ctx,
			http.StatusConflict,
			"IS_OIDC",
			true,
			nil,
		)
		return
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	apiAccess.User.Password = string(hash)
	s.DB.Updates(&apiAccess.User)
	util.GenerateResponse(
		ctx,
		http.StatusOK,
		"PASSWORD_CHANGED",
		false,
		nil,
	)
}

func (s *ActionsService) PermissionsChange(ctx *gin.Context, data dto.ActionPermissionChange) {

}
