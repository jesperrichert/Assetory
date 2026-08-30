package util

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GenerateResponse(ctx *gin.Context, code int, message string, isError bool, data any) {
	ctx.JSON(code, gin.H{
		"message": message,
		"code":    code,
		"success": !isError,
		"data":    data,
	})
}

func GenerateAuthRedirect(ctx *gin.Context, details string, isError bool) {
	ctx.Redirect(http.StatusPermanentRedirect, "/auth?success="+strconv.FormatBool(!isError)+"&details="+details+"")
}

func GetSettionID(ctx *gin.Context) string {
	session := ctx.Request.Header.Get("Authorization")
	return session
}
