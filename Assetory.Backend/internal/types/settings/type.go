package settings

type SettingsType int

const (
	PasswordChange SettingsType = iota
)

var settingsTypeName = map[SettingsType]string{
	PasswordChange: "password_change",
}

func (s SettingsType) String() string {
	return settingsTypeName[s]
}

func ToAllSettingTypes() []string {
	var types []string
	for _, v := range settingsTypeName {
		types = append(types, v)
	}
	return types
}
