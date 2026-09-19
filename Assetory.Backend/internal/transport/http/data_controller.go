package http

import (
	"net/http"
	"slices"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"jespersen.zip.assetory/internal/dto"
	"jespersen.zip.assetory/internal/model"
	"jespersen.zip.assetory/internal/services"
	"jespersen.zip.assetory/internal/types/permissions"
	"jespersen.zip.assetory/internal/util"
)

type DataController struct {
	DB      *gorm.DB
	Service *services.DataService
}

func NewDataController(db *gorm.DB, service *services.DataService) *DataController {
	return &DataController{
		DB:      db,
		Service: service,
	}
}

func (c *DataController) Permissions(ctx *gin.Context) {
	isVaild, _ := util.Permission(*c.DB, util.GetSettionID(ctx), permissions.DataPermissions.Permission())
	if !isVaild {
		util.GenerateResponse(ctx, http.StatusUnauthorized, "No Session found.", true, nil)
		return
	}

	util.GenerateResponse(
		ctx,
		http.StatusOK,
		"PERMISSIONS_DATA",
		false,
		permissions.AllTypes(),
	)
}

func (c *DataController) Users(ctx *gin.Context) {
	isVaild, _ := util.Permissions(*c.DB, util.GetSettionID(ctx), []string{
		permissions.DataPermissions.Permission(),
		permissions.PermissionChange.Permission(),
	})
	if !isVaild {
		util.GenerateResponse(ctx, http.StatusUnauthorized, "No Session found.", true, nil)
		return
	}

	var users []model.User
	c.DB.Select("id", "user_name").Find(&users)
	userDtos := []dto.UserDataDto{}
	for _, u := range users {
		userDtos = append(userDtos, dto.UserDataDto{
			Username: u.UserName,
			UserId:   int(u.ID),
		})
	}
	util.GenerateResponse(
		ctx,
		http.StatusOK,
		"USERS",
		false,
		userDtos,
	)
}

func (c *DataController) UserPermissions(ctx *gin.Context) {
	isVaild, _ := util.Permissions(*c.DB, util.GetSettionID(ctx), []string{
		permissions.DataUserPermissions.Permission(),
		permissions.PermissionChange.Permission(),
	})
	if !isVaild {
		util.GenerateResponse(ctx, http.StatusUnauthorized, "No Session found.", true, nil)
		return
	}
	userId := ctx.Param("userId")

	var user model.User
	c.DB.Where("id = ?", userId).First(&user)
	perms := user.Permissions
	if slices.Contains(user.Permissions, permissions.Star.Permission()) {
		perms = permissions.AllTypesWithOutSpecial()
	}
	util.GenerateResponse(
		ctx,
		http.StatusOK,
		"USER_PERMISSIONS",
		false,
		perms,
	)
}
