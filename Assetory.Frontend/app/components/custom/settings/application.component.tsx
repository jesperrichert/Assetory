import { useContext } from "react";
import { AuthContext } from "~/context/auth.context";
import { EditAuthSettingsSetting } from "./user/edit-auth-settings.component";
import { canView, Permission } from "~/types/permission";

export function ApplicationSettings() {
  const authContext = useContext(AuthContext);
  return (
    <div className="grid grid-cols-6">
      {canView(authContext?.user?.permissions ?? [], [Permission.EditAuth]) && (
        <EditAuthSettingsSetting />
      )}
    </div>
  );
}
