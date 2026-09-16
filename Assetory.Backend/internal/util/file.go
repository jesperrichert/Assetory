package util

import (
	"os"
	"strings"

	"jespersen.zip.assetory/internal/dto"
)

func CheckFileValid(filePath string) bool {
	if strings.HasPrefix(filePath, "/") {
		return false
	}
	if strings.Contains(filePath, "../") {
		return false
	}
	return true
}

func MapDirs(data *dto.DiscoveryDto, path string) {
	dir, _ := os.ReadDir(path)

	var files []dto.DiscoveryFileDto

	for i := range dir {
		file := dir[i]
		if file.IsDir() {
			go MapDirs(data, path+file.Name())
		} else {
			files = append(files, dto.DiscoveryFileDto{
				Name: file.Name(),
			})
		}
	}

	folderName := strings.ReplaceAll(path, "/app", "")
	data.SubFolders = append(data.SubFolders, dto.DiscoveryFolderDto{
		Name:  strings.ReplaceAll(folderName, "/storage/", ""),
		Files: files,
	})
}
