package dto

type UserDto struct {
	Id          int      `json:"id"`
	UserName    string   `json:"username"`
	IsOidc      bool     `json:"isOidc"`
	Permissions []string `json:"permissions"`
}
