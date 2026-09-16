package services

import (
	"net/http"
	"os"
	"strings"

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
	path := ctx.PostForm("path") + "/"
	if len(path) <= 0 {
		util.GenerateResponse(ctx, http.StatusBadRequest, "Please provide a \"path\" for your file.", true, nil)
		return
	}
	if err != nil {
		util.GenerateResponse(ctx, http.StatusConflict, "Failed to Upload file.", true, nil)
		return
	}
	fileStr := strings.ReplaceAll(path+fileData.Filename, ":", "/")

	isFileVaild := util.CheckFileValid(fileStr)
	if !isFileVaild {
		util.GenerateResponse(ctx, http.StatusInternalServerError, "Uploaded invalid File.", true, nil)
		return
	}

	err = ctx.SaveUploadedFile(fileData, "/app/storage/"+fileStr)
	if err != nil {
		println(err.Error())
		util.GenerateResponse(ctx, http.StatusConflict, "Failed to Write file.", true, nil)
		return
	} else {
		util.GenerateResponse(ctx, http.StatusOK, "", false, nil)
		return
	}
}

func (e *StorageService) GetFile(ctx *gin.Context, name string) {
	fileStr := strings.ReplaceAll(name, ":", "/")
	isFileVaild := util.CheckFileValid(fileStr)
	if !isFileVaild {
		util.GenerateResponse(ctx, http.StatusInternalServerError, "Failed to get file raw!", true, nil)
		return
	}
	ctx.File("/app/storage/" + fileStr)
}

func (e *StorageService) GetFileInfo(ctx *gin.Context, name string) {
	fileStr := strings.ReplaceAll(name, ":", "/")
	isFileVaild := util.CheckFileValid(fileStr)
	println(isFileVaild)
	if !isFileVaild {
		util.GenerateResponse(ctx, http.StatusInternalServerError, "Failed to find file path", true, nil)
		return
	}

	file, err := os.Lstat("/app/storage/" + fileStr)
	if err != nil {
		util.GenerateResponse(ctx, http.StatusInternalServerError, "Filed to fetch file info", true, nil)
		return
	}

	util.GenerateResponse(ctx, http.StatusOK, "INFO", true, &dto.FileInfoDto{
		Name:             file.Name(),
		Size:             file.Size(),
		FolderName:       "/storage/" + fileStr,
		LastModification: file.ModTime().String(),
	})
}

func (e *StorageService) DeleteFile(ctx *gin.Context, name string) {
	fileStr := strings.ReplaceAll(name, ":", "/")

	isFileVaild := util.CheckFileValid(fileStr)
	if !isFileVaild {
		util.GenerateResponse(ctx, http.StatusInternalServerError, "Uploaded invalid File.", true, nil)
		return
	}
	err := os.Remove("/app/storage/" + fileStr)

	pathStrPos := len(strings.Split(fileStr, "/"))
	pathStr := strings.SplitAfterN(fileStr, "/", pathStrPos)[0]
	dirs, _ := os.ReadDir("/app/storage/" + pathStr)
	if len(dirs) <= 0 {
		err = os.Remove("/app/storage/" + pathStr)
	}

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
	for i := range dir {
		file := dir[i]
		if file.IsDir() {
			util.MapDirs(&data, "/app/storage/"+file.Name())
		}
	}

	util.GenerateResponse(ctx, http.StatusOK, "DISCOVERY", false, data)
}
