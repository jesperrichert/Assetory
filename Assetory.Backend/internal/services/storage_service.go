package services

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"jespersen.zip.assetory/internal/dto"
	"jespersen.zip.assetory/internal/env"
	"jespersen.zip.assetory/internal/util"
)

type StorageService struct {
	Config *env.Config
}

func NewStorageService(config *env.Config) *StorageService {
	return &StorageService{
		Config: config,
	}
}

func (e *StorageService) WriteFile(ctx *gin.Context) {
	fileData, err := ctx.FormFile("file")
	if err != nil {
		util.GenerateResponse(ctx, http.StatusConflict, "Failed to Upload file.", true, nil)
		return
	}
	isFileVaild := util.CheckFile(fileData.Filename)
	if !isFileVaild {
		util.GenerateResponse(ctx, http.StatusInternalServerError, "Uploaded invalid File.", true, nil)
		return
	}
	err = ctx.SaveUploadedFile(fileData, "/app/storage/"+fileData.Filename)
	if err != nil {
		util.GenerateResponse(ctx, http.StatusConflict, "Failed to Write file.", true, nil)
		return
	} else {
		util.GenerateResponse(ctx, http.StatusOK, "", false, nil)
		return
	}
}

func (e *StorageService) GetFile(ctx *gin.Context, name string) {
	isFileVaild := util.CheckFile(name)
	if !isFileVaild {
		util.GenerateResponse(ctx, http.StatusInternalServerError, "Uploaded invalid File.", true, nil)
		return
	}
	ctx.File("/app/storage/" + name)
}

func (e *StorageService) GetFileInfo(ctx *gin.Context, name string) {
	isFileVaild := util.CheckFile(name)
	if !isFileVaild {
		util.GenerateResponse(ctx, http.StatusInternalServerError, "Uploaded invalid File.", true, nil)
		return
	}

	file, err := os.Lstat("/app/storage/" + name)
	if err != nil {
		util.GenerateResponse(ctx, http.StatusInternalServerError, "Filed to fetch file info", true, nil)
		return
	}

	util.GenerateResponse(ctx, http.StatusOK, "INFO", true, &dto.FileInfoDto{
		Name:             file.Name(),
		Size:             file.Size(),
		FolderName:       "/storage/" + name,
		LastModification: file.ModTime().String(),
	})
}

func (e *StorageService) DeleteFile(ctx *gin.Context, name string) {
	isFileVaild := util.CheckFile(name)
	if !isFileVaild {
		util.GenerateResponse(ctx, http.StatusInternalServerError, "Uploaded invalid File.", true, nil)
		return
	}
	err := os.Remove("/app/storage/" + name)
	if err != nil {
		util.GenerateResponse(ctx, http.StatusConflict, "Failed to Delete file.", true, nil)
		return
	} else {
		util.GenerateResponse(ctx, http.StatusOK, "Successfull deleted file!", false, nil)
		return
	}
}

func (e *StorageService) Discovery(ctx *gin.Context) {
	dir, err := os.ReadDir("/app/storage/")
	if err != nil {
		util.GenerateResponse(ctx, http.StatusConflict, "Failed to fetch Discovery Entries!", false, nil)
		return
	}

	var data dto.DiscoveryDto
	var hasDir bool = false
	for i := range dir {
		file := dir[i]
		if file.IsDir() {
			hasDir = true
			isMappingDone := util.MapDirs(&data, "/app/storage/"+file.Name())
			if isMappingDone {
				util.GenerateResponse(ctx, http.StatusOK, "DISCOVERY", false, data)
			}
		} else {
			data.Files = append(data.Files, dto.DiscoveryFileDto{
				Name: file.Name(),
			})
		}
	}
	if !hasDir {
		util.GenerateResponse(ctx, http.StatusOK, "DISCOVERY", false, data)
	}
}
