package dto

type FileInfoDto struct {
	Name             string `json:"name"`
	Size             int64  `json:"size"`
	FolderName       string `json:"folder_name"`
	LastModification string `json:"last_modification"`
}
