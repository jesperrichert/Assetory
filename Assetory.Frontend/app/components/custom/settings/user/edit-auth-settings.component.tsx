import { PasswordIcon } from "@phosphor-icons/react";
import {
  EditIcon,
  EthernetPort,
  IndianRupeeIcon,
  UserShield,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { AuthContext } from "~/context/auth.context";

type AuthSettingsDto = {
  is_register_disabled: false;
  is_oidc_disabled: false;
  is_oidc_registration_disabled: false;
};

export function EditAuthSettingsSetting() {
  const authContext = useContext(AuthContext);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<AuthSettingsDto | null>();

  useEffect(() => {
    f();
  });

  const f = async () => {
    if (settings != null) return;
    const req = await fetch("/api/data/auth", {
      headers: {
        Authorization: authContext?.session ?? "",
      },
    });
    if (req.status != 200) return toast("Failed to fetch Auth Settings!");
    const data = await req.json();
    setSettings(data.data);
  };

  const handle = async () => {
    if (settings == null) return toast("No Settings set.");
    const req = await fetch("/api/actions", {
      method: "POST",
      headers: {
        Authorization: authContext?.session ?? "",
      },
      body: JSON.stringify({
        action: "edit_auth",
        data: settings,
      }),
    });
    if (req.status == 200) {
      toast("Settings changed successfully");
      setOpen(false);
      f()
    } else {
      const json = await req.json();
      toast(`Failed with Code: ${json.message}`);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={"outline"}
        className="cursor-pointer"
      >
        <EditIcon />
        <span>Edit Auth Settings</span>
      </Button>

      <Dialog onOpenChange={() => setOpen(false)} open={isOpen}>
        <DialogContent className="rounded-2xl bg-secondary text-white">
          <DialogHeader>
            <DialogTitle>Edit Auth Settings</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col">
            <div>
              <label>Settings:</label>
              <div className="grid grid-cols-2">
                {settings != null
                  ? Object.keys(settings!!).map((setting) => {
                      return (
                        <label className="inline-flex gap-3">
                          <input
                            checked={settings[setting]}
                            className="ring-0 outline-0 rounded-2xl gap-2 p-1"
                            type="checkbox"
                            id={setting}
                            name={setting}
                            value={setting}
                            key={setting}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                [setting]: !settings[setting],
                              });
                              console.log(settings);
                            }}
                          />
                          <span className="text-white p-0.5">{setting.replaceAll("_", " ")}</span>
                        </label>
                      );
                    })
                  : ""}
              </div>
              <hr className="mb-1"></hr>
            </div>
            <div>
              <Button
                className="cursor-pointer inline-flex p-3"
                variant={"outline"}
                onClick={handle}
              >
                <EditIcon />
                Edit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
