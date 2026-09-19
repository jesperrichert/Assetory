import { PasswordIcon } from "@phosphor-icons/react";
import { Button } from "~/components/ui/button";
import { ChangePasswordSetting } from "./user/password-change.component";
import { useContext } from "react";
import { AuthContext } from "~/context/auth.context";
import { canView, Permission } from "~/types/permission";

export function UserSettings() {
  // const authContext = useContext(AuthContext);
  return (
    <div className="grid grid-cols-6">
      <ChangePasswordSetting />
    </div>
  );
}
