package util

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"jespersen.zip.assetory/internal/dto"
)

func RetunSettingsSchemaForSetting[T any](ctx *gin.Context, body dto.ActionsBaseDto[T]) {
	GenerateResponse(
		ctx,
		http.StatusBadRequest,
		"INVALID_ACTION_DATA",
		true,
		body,
	)
}
