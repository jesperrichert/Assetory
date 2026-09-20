package dto

type ActionsBaseDto[T any] struct {
	Action string `json:"action"`
	Data   T      `json:"data"`
}

type ActionPasswordChange struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}

type ActionPermissionChange struct {
	UserId      int      `json:"user_id"`
	Permissions []string `json:"permissions"`
}

type ActionEditAuth struct {
	IsRegisterDisabled         bool `json:"is_register_disabled"`
	IsOidcDisabled             bool `json:"is_oidc_disabled"`
	IsOidcRegistrationDisabled bool `json:"is_oidc_registration_disabled"`
}
