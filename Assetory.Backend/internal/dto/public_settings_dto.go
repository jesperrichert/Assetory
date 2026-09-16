package dto

type PublicSettingsDto struct {
	AllowRegister []string `json:"allowRegister"` // OIDC, LOCAL
}
