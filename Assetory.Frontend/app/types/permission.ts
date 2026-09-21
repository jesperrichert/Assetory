export enum Permission {
  StorageRaw = "storage:raw",
  DataAuthSettings = "data:auth",
  EditAuth = "action:edit_auth",
  Star = "*:*",
  DataUserPermissions = "data:user_permissions",
  OIDC = "oidc",
  DataUsers = "data:users",
  StorageDiscovery = "storage:discovery",
  StorageDelete = "storage:delete",
  StorageGet = "storage:get",
  StoragePost = "storage:post",
  DataPermissions = "data:permissions",
  PermissionChange = "action:permission_change",
}

export function canView(
  permissions: string[],
  requestedPerms: string[],
): boolean {
  if (permissions.includes(Permission.Star)) return true;
  if (
    requestedPerms.some((p) => {
      permissions.includes(p);
    })
  )
    return true;
  return false;
}
