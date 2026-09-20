package actions

type ActionsType int

const (
	PasswordChange   ActionsType = iota
	PermissionChange ActionsType = iota
	EditAuth         ActionsType = iota
)

var actionsTypeName = map[ActionsType]string{
	PasswordChange:   "password_change",
	PermissionChange: "permission_change",
	EditAuth:         "edit_auth",
}

func (s ActionsType) Action() string {
	return actionsTypeName[s]
}

func AllTypes() []string {
	var types []string
	for _, v := range actionsTypeName {
		types = append(types, v)
	}
	return types
}
