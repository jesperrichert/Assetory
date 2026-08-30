package util

import (
	"os"
	"regexp"

	"jespersen.zip.assetory/internal/dto"
)

func CheckFile(filePath string) bool {
	matched, err := regexp.MatchString(`^[a-zA-Z0-9_\-.]+$`, filePath)
	if err != nil {
		return false
	}
	return matched
}

func MapDirs(data *dto.DiscoveryDto, path string) bool {
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

	data.SubFolders = append(data.SubFolders, dto.DiscoveryFolderDto{
		Name:  path,
		Files: files,
	})
	return true
}
