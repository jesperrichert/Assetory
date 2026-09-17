package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"jespersen.zip.assetory/internal/dto"
	"jespersen.zip.assetory/internal/services"
	"jespersen.zip.assetory/internal/types/actions"
	"jespersen.zip.assetory/internal/types/permissions"
	"jespersen.zip.assetory/internal/util"
)

type ActionsController struct {
	DB      *gorm.DB
	Service *services.ActionsService
}

func NewActionsController(db *gorm.DB, service *services.ActionsService) *ActionsController {
	return &ActionsController{
		DB:      db,
		Service: service,
	}
}

// POST
func (e *ActionsController) Post(ctx *gin.Context) {
	session := util.GetSettionID(ctx)
	var baseBody dto.ActionsBaseDto[any]
	err := ctx.ShouldBindBodyWithJSON(&baseBody)

	if err != nil {
		util.GenerateResponse(
			ctx,
			http.StatusBadRequest,
			"INVALID_SETTING_ID",
			true,
			actions.AllTypes(),
		)
	}

	switch baseBody.Setting {
	case actions.PasswordChange.String():
		{
			var body dto.ActionsBaseDto[dto.ActionPasswordChange]
			err = ctx.ShouldBindBodyWithJSON(&body)
			if err != nil {
				util.RetunSettingsSchemaForSetting(ctx, body)
				return
			}
			e.Service.PasswordChange(ctx, body.Data.OldPassword, body.Data.NewPassword)
		}
	case actions.PermissionChange.String():
		{
			isValid, _ := util.Permission(*e.DB, session, permissions.PermissionChange.Permission())
			if !isValid {
				util.GenerateResponse(
					ctx,
					http.StatusUnauthorized,
					"Unauthorized",
					true,
					nil,
				)
				return
			}

			var body dto.ActionsBaseDto[dto.ActionPermissionChange]
			err = ctx.ShouldBindBodyWithJSON(&body)
			if err != nil {
				util.RetunSettingsSchemaForSetting(ctx, body)
				return
			}
			e.Service.PermissionsChange(ctx, body.Data)
		}
	}

}
