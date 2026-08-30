package dto

type DiscoveryDto struct {
	Files      []DiscoveryFileDto   `json:"files"`
	SubFolders []DiscoveryFolderDto `json:"folders"`
}

type DiscoveryFileDto struct {
	Name string `json:"name"`
}

type DiscoveryFolderDto struct {
	Name  string             `json:"name"`
	Files []DiscoveryFileDto `json:"files"`
}
