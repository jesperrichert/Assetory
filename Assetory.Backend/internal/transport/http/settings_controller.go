package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"jespersen.zip.assetory/internal/dto"
	"jespersen.zip.assetory/internal/services"
	"jespersen.zip.assetory/internal/types/settings"
	"jespersen.zip.assetory/internal/util"
)

type SetingsController struct {
	DB      *gorm.DB
	Service *services.SetingsService
}

func NewSetingsController(db *gorm.DB, service *services.SetingsService) *SetingsController {
	return &SetingsController{
		DB:      db,
		Service: service,
	}
}

// POST
func (e *SetingsController) Post(ctx *gin.Context) {
	var baseBody dto.SettingsBaseDto[any]
	err := ctx.ShouldBindBodyWithJSON(&baseBody)
	if err != nil {
		util.GenerateResponse(
			ctx,
			http.StatusBadRequest,
			"INVALID_SETTING_ID",
			true,
			settings.ToAllSettingTypes(),
		)
	}

	switch baseBody.Setting {
	case settings.PasswordChange.String():
		{
			var body dto.SettingsBaseDto[dto.SettingPasswordChange]
			err = ctx.ShouldBindBodyWithJSON(&body)
			if err != nil {
				util.RetunSettingsSchemaForSetting(ctx, body)
				return
			}
			e.Service.PasswordChange(ctx, body.Data.OldPassword, body.Data.NewPassword)
		}
	}

}
