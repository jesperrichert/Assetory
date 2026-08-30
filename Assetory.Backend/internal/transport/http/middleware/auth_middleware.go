package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"jespersen.zip.assetory/internal/model"
	"jespersen.zip.assetory/internal/util"
)

type AuthMiddleware struct {
	DB *gorm.DB
}

func NewAuthMiddleware(db *gorm.DB) *AuthMiddleware {
	return &AuthMiddleware{
		DB: db,
	}
}

func (middleware *AuthMiddleware) Handle(ctx *gin.Context) {
	token := ctx.GetHeader("Authorization")
	if len(token) == 0 {
		util.GenerateResponse(
			ctx,
			http.StatusUnauthorized,
			"Unauthorized",
			true,
			nil,
		)
		ctx.Abort()
		return
	}
	var access model.APIAccess
	middleware.DB.First(&access, "token = ?", token)

	if len(access.Token) == 0 {
		util.GenerateResponse(
			ctx,
			http.StatusUnauthorized,
			"Unauthorized",
			true,
			nil,
		)
		ctx.Abort()
		return
	}
	ctx.Next()
}
