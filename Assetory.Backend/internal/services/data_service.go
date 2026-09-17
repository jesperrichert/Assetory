package services

import (
	"gorm.io/gorm"
	"jespersen.zip.assetory/internal/env"
)

type DataService struct {
	Config *env.Config
	DB     *gorm.DB
}

func NewDataService(db *gorm.DB, config *env.Config) *DataService {
	return &DataService{
		Config: config,
		DB:     db,
	}
}

// func (s *DataService) Pass() {
// }
