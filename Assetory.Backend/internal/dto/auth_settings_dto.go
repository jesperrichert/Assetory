package dto

type AuthSettingsDto struct {
	IsRegisterDisabled         bool `json:"is_register_disabled"`
	IsOidcDisabled             bool `json:"is_oidc_disabled"`
	IsOidcRegistrationDisabled bool `json:"is_oidc_registration_disabled"`
}
