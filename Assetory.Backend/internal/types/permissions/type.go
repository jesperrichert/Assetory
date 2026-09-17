package permissions

type Permissions int

const (
	DataPermissions     Permissions = iota
	PermissionChange    Permissions = iota
	StoragePost         Permissions = iota
	StorageGet          Permissions = iota
	StorageDelete       Permissions = iota
	StorageDiscovery    Permissions = iota
	SettingsUser        Permissions = iota
	SettingsApplication Permissions = iota
	SettingsAdmin       Permissions = iota
	OIDC                Permissions = iota
)

var permissionsTypeName = map[Permissions]string{
	OIDC:                "oidc",
	SettingsAdmin:       "settings:admin",
	SettingsApplication: "settings:application",
	SettingsUser:        "settings:user",
	StorageDiscovery:    "storage:discovery",
	StorageDelete:       "storage:delete",
	StorageGet:          "storage:get",
	StoragePost:         "storage:post",
	DataPermissions:     "data:permissions",
	PermissionChange:    "action:permission_change",
}

func (s Permissions) Permission() string {
	return permissionsTypeName[s]
}

func AllTypes() []string {
	var types []string
	for _, v := range permissionsTypeName {
		types = append(types, v)
	}
	return types
}
