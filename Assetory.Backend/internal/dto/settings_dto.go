package dto

type SettingsBaseDto[T any] struct {
	Setting string `json:"setting"`
	Data    T      `json:"data"`
}

type SettingPasswordChange struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}
