import { PasswordIcon } from "@phosphor-icons/react";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { AuthContext } from "~/context/auth.context";

export function ChangePasswordSetting() {
  const authContext = useContext(AuthContext);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState<string | null>(null);

  const handle = async () => {
    const req = await fetch("/api/actions", {
      method: "POST",
      headers: {
        Authorization: authContext?.session ?? "",
      },
      body: JSON.stringify({
        setting: "password_change",
        data: {
          old_password: oldPassword,
          new_password: newPassword,
        },
      }),
    });
    if (req.status == 200) {
      toast("Password changed successfully");
      setOpen(false);
    } else {
      const json = await req.json()
      toast(`Failed with Code: ${json.message}`)
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant={"outline"} className="cursor-pointer">
        <PasswordIcon />
        <span>Change Password</span>
      </Button>

      <Dialog onOpenChange={() => setOpen(false)} open={isOpen}>
        <DialogContent className="rounded-2xl bg-secondary text-white">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col">
            <div>
              <label htmlFor="oldpw">Old Password:</label>
              <input
                className="ring-0 outline-0 rounded-2xl gap-2 p-1"
                id="oldpw"
                type="password"
                onChange={(e) => setOldPassword(e.target.value)}
              ></input>
              <hr className="mb-1"></hr>
            </div>
            <div>
              <label htmlFor="newpw">New Password:</label>
              <input
                className="ring-0 outline-0 rounded-2xl gap-2 p-1"
                id="newpw"
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
              ></input>
              <hr className="mb-1"></hr>
            </div>
            <div>
              <Button
                className="cursor-pointer inline-flex p-3"
                variant={"outline"}
                onClick={handle}
              >
                <PasswordIcon /> Change Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
