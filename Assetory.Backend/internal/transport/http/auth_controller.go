package http

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"jespersen.zip.assetory/internal/dto"
	"jespersen.zip.assetory/internal/model"
	"jespersen.zip.assetory/internal/services"
	"jespersen.zip.assetory/internal/util"
)

type AuthController struct {
	DB      *gorm.DB
	Service *services.AuthService
}

func NewAuthController(db *gorm.DB, service *services.AuthService) *AuthController {
	return &AuthController{
		DB:      db,
		Service: service,
	}
}

// GET
func (e *AuthController) Me(ctx *gin.Context) {
	sessionId := util.GetSettionID(ctx)
	var apiAccess model.APIAccess
	e.DB.Where("token = ?", sessionId).Preload("User").First(&apiAccess)
	if len(apiAccess.Token) == 0 {
		util.GenerateResponse(
			ctx,
			http.StatusUnauthorized,
			"Unauthorized",
			true,
			nil,
		)
		return
	}
	util.GenerateResponse(
		ctx,
		http.StatusOK,
		"USER",
		true,
		dto.UserDto{
			UserName:    apiAccess.User.UserName,
			IsOidc:      apiAccess.User.IsOidc,
			Permissions: apiAccess.Permissions,
		},
	)
}

// POST
func (e *AuthController) Register(ctx *gin.Context) {
	var settings model.Settings
	e.DB.First(&settings)
	if settings.IsRegisterDisabled {
		util.GenerateResponse(
			ctx,
			http.StatusMethodNotAllowed,
			"Registration is Disabled",
			true,
			nil,
		)
		return
	}
	var data dto.LocalUserDto
	json.NewDecoder(ctx.Request.Body).Decode(&data)
	defer ctx.Request.Body.Close()
	e.Service.Register(ctx, data.Username, data.Password)
}

// GET
func (e *AuthController) Login(ctx *gin.Context) {
	var data dto.LocalUserDto
	json.NewDecoder(ctx.Request.Body).Decode(&data)
	defer ctx.Request.Body.Close()
	e.Service.Login(ctx, data.Username, data.Password)
}

// GET
func (e *AuthController) Oidc(ctx *gin.Context) {
	var settings model.Settings
	e.DB.First(&settings)
	if settings.IsOidcDisabled {
		util.GenerateResponse(
			ctx,
			http.StatusMethodNotAllowed,
			"OIDC is Disabled",
			true,
			nil,
		)
		return
	}
	e.Service.Oidc(ctx, ctx.Query("code"))
}

// GET
func (e *AuthController) OidcConfig(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"authenticationUrl": e.Service.GenerateOidcAuthorizationUrl(),
	})
}

// GET
func (e *AuthController) Config(ctx *gin.Context) {
	var settings model.Settings
	e.DB.First(&settings)
	ctx.JSON(http.StatusOK, gin.H{
		"showRegister": !settings.IsRegisterDisabled,
		"showOidc":     !settings.IsOidcDisabled,
	})
}
