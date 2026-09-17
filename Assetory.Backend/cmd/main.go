package main

import (
	"jespersen.zip.assetory/internal/config"
	"jespersen.zip.assetory/internal/env"
)

func main() {
	app := config.NewGin()
	db := config.NewDatabase()
	config.NewWeb(app)
	env := env.NewConfig()
	config.Build(&config.Appconfig{
		App:    app,
		DB:     db,
		Config: env,
	})

	config.DefaultAdminAccountInit(db)

	err := app.Run(":3000")
	if err != nil {
		return
	}
}
