package util

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"jespersen.zip.assetory/internal/dto"
)

func RetunSettingsSchemaForSetting[T any](ctx *gin.Context, body dto.SettingsBaseDto[T]) {
	GenerateResponse(
		ctx,
		http.StatusBadRequest,
		"INVALID_SETTING_DATA",
		true,
		body,
	)
}
