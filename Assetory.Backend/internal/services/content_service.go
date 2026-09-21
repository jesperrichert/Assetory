package services

import (
	"gorm.io/gorm"
	"jespersen.zip.assetory/internal/env"
)

type ContentService struct {
	Config *env.Config
	DB     *gorm.DB
}

func NewContentService(db *gorm.DB, config *env.Config) *ContentService {
	return &ContentService{
		Config: config,
		DB:     db,
	}
}

// func (s *DataService) Pass() {
// }
