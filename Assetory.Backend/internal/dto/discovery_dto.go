package dto

type DiscoveryDto struct {
	SubFolders []DiscoveryFolderDto `json:"folders"`
}

type DiscoveryFileDto struct {
	Name string `json:"name"`
}

type DiscoveryFolderDto struct {
	Name  string             `json:"name"`
	Files []DiscoveryFileDto `json:"files"`
}
