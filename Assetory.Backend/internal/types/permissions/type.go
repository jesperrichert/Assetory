package permissions

import "strings"

type Permissions int

const (
	Star                Permissions = iota
	DataUsers           Permissions = iota
	DataPermissions     Permissions = iota
	DataAuthSettings    Permissions = iota
	DataUserPermissions Permissions = iota
	PermissionChange    Permissions = iota
	StoragePost         Permissions = iota
	StorageGet          Permissions = iota
	StorageDelete       Permissions = iota
	StorageDiscovery    Permissions = iota
	OIDC                Permissions = iota
	EditAuth            Permissions = iota
)

var permissionsTypeName = map[Permissions]string{
	DataAuthSettings:    "data:auth",
	EditAuth:            "action:edit_auth",
	Star:                "*:*",
	DataUserPermissions: "data:user_permissions",
	OIDC:                "oidc",
	DataUsers:           "data:users",
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

func AllTypesWithOutSpecial() []string {
	var types []string
	for _, v := range permissionsTypeName {
		if strings.Contains(v, ":") {
			types = append(types, v)
		}
	}
	return types
}
