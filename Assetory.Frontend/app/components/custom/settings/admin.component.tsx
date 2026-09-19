import { useContext } from "react";
import { Button } from "~/components/ui/button";
import { AuthContext } from "~/context/auth.context";
import { ChangePermissionSetting } from "./user/permission-change.component";
import { canView, Permission } from "~/types/permission";

export function AdminSettings() {
  const authContext = useContext(AuthContext);

  if (
    authContext?.session == null &&
    authContext?.user?.permissions.includes("settings:admin")
  )
    return;

  return (
    <div className="grid grid-cols-6">
      {canView(authContext?.user?.permissions ?? [], [
        Permission.PermissionChange,
      ]) && <ChangePermissionSetting />}
    </div>
  );
}
