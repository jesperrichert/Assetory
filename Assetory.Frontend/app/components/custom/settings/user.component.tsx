import { PasswordIcon } from "@phosphor-icons/react";
import { Button } from "~/components/ui/button";
import { ChangePasswordSetting } from "./user/password-change.component";

export function UserSettings() {
  return (
    <div className="grid grid-cols-6">
      <ChangePasswordSetting />
    </div>
  );
}
