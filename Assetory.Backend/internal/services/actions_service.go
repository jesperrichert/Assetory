package services

import (
	"net/http"
	"slices"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"jespersen.zip.assetory/internal/dto"
	"jespersen.zip.assetory/internal/env"
	"jespersen.zip.assetory/internal/model"
	"jespersen.zip.assetory/internal/types/permissions"
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

func (s *ActionsService) PermissionsChange(ctx *gin.Context, currentUser *model.User, data dto.ActionPermissionChange) {
	var user model.User
	s.DB.Where("id = ?", data.UserId).Preload("APIAccess").First(&user)
	if len(user.UserName) <= 0 {
		util.GenerateResponse(
			ctx,
			http.StatusNotFound,
			"NO_USER",
			true,
			nil,
		)
		return
	}

	if user.ID == currentUser.ID {
		util.GenerateResponse(
			ctx,
			http.StatusBadRequest,
			"CAN_NOT_CHANGE_YOURSELF",
			true,
			nil,
		)
		return
	}

	perms := data.Permissions
	for _, p := range perms {
		if !strings.Contains(p, ":") {
			println(p)
			util.GenerateResponse(
				ctx,
				http.StatusBadRequest,
				"NOT_ASSIGNABLE",
				true,
				nil,
			)
			return
		}
		if !slices.Contains(permissions.AllTypes(), p) {
			util.GenerateResponse(
				ctx,
				http.StatusBadRequest,
				"ONE_OR_MANY_PERMISSIONS_NOT_FOUND",
				true,
				nil,
			)
			return
		}
		if !slices.Contains(currentUser.Permissions, p) &&
			!slices.Contains(currentUser.Permissions, permissions.Star.Permission()) {
			util.GenerateResponse(
				ctx,
				http.StatusUnauthorized,
				"CAN_NOT_GIVE_PERMISSION",
				true,
				nil,
			)
			return
		}
	}

	for _, p := range perms {
		if !strings.Contains(p, ":") {
			perms = append(perms, p)
		}
	}
	user.Permissions = perms
	s.DB.Updates(&user)

	for _, apiAccess := range *user.APIAccess {
		accessPerms := perms
		if apiAccess.IsApiKey {
			hasStar := slices.Contains(user.Permissions, permissions.Star.Permission())
			apiAccess.Permissions = slices.DeleteFunc(apiAccess.Permissions, func(p string) bool {
				if slices.Contains(accessPerms, p) {
					return false
				}
				return !hasStar
			})
		} else {
			apiAccess.Permissions = accessPerms
		}
		s.DB.Updates(&apiAccess)
	}

	util.GenerateResponse(
		ctx,
		http.StatusOK,
		"PERMISSION_CHANGED",
		false,
		nil,
	)
}
