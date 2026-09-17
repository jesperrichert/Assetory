package dto

type ActionsBaseDto[T any] struct {
	Setting string `json:"setting"`
	Data    T      `json:"data"`
}

type ActionPasswordChange struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}

type ActionPermissionChange struct {
	UserId      string   `json:"user_id"`
	Permissions []string `json:"permissions"`
}
