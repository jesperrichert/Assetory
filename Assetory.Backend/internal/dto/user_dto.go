package dto

type UserDto struct {
	UserName string `json:"username"`
	IsOidc   bool   `json:"isOidc"`
}
