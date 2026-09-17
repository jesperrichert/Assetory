package actions

type ActionsType int

const (
	PasswordChange   ActionsType = iota
	PermissionChange ActionsType = iota
)

var actionsTypeName = map[ActionsType]string{
	PasswordChange:   "password_change",
	PermissionChange: "permissions_change",
}

func (s ActionsType) String() string {
	return actionsTypeName[s]
}

func ToAllSettingTypes() []string {
	var types []string
	for _, v := range actionsTypeName {
		types = append(types, v)
	}
	return types
}
