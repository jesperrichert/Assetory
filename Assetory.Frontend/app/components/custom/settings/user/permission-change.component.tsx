import { PasswordIcon } from "@phosphor-icons/react";
import { IndianRupeeIcon, UserShield } from "lucide-react";
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

type UserDataDto = {
  username: string;
  user_id: number;
};

type SelectablePermission = {
  permission: string;
  selected: boolean;
};

export function ChangePermissionSetting() {
  const authContext = useContext(AuthContext);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);

  const [selectablePermissions, setSelectablePermissions] = useState<
    SelectablePermission[]
  >([]);
  const [selectableUsers, setSelectableUsers] = useState<UserDataDto[]>([]);

  useEffect(() => {
    async function defaultData() {
      if (selectablePermissions.length <= 0) {
        const reqPerms = await fetch(
          `/api/data/users/${authContext?.user?.id}/permissions`,
          {
            headers: {
              Authorization: authContext?.session ?? "",
            },
          },
        );
        if (reqPerms.status != 200)
          return toast("Failed to fetch defalt permissions!");
        const jsonPerms = await reqPerms.json();
        setSelectablePermissions(
          jsonPerms.data.map((p: string) => {
            return {
              permission: p,
              selected: false,
            };
          }),
        );
      }

      if (selectableUsers.length <= 0) {
        const reqUsers = await fetch(`/api/data/users`, {
          headers: {
            Authorization: authContext?.session ?? "",
          },
        });
        if (reqUsers.status != 200) return toast("Failed to fetch users!");
        const jsonUsers = await reqUsers.json();
        setSelectableUsers(jsonUsers.data);
      }
    }
    defaultData();
  });

  const fetchSelectedUserPerms = async (userId: number) => {
    setUserId(userId)
    const reqPerms = await fetch(`/api/data/users/${userId}/permissions`, {
      headers: {
        Authorization: authContext?.session ?? "",
      },
    });
    if (reqPerms.status != 200)
      return toast("Failed to fetch permissions from selected user!");
    const jsonPerms = await reqPerms.json();
    setPermissions(jsonPerms.data);
    setSelectablePermissions(
      selectablePermissions.map((perm) => {
        return {
          permission: perm.permission,
          selected: (jsonPerms.data as string[]).includes(perm.permission),
        };
      }),
    );
  };

  const handle = async () => {
    if (userId == null) return toast("Select a User!");    

    const req = await fetch("/api/actions", {
      method: "POST",
      headers: {
        Authorization: authContext?.session ?? "",
      },
      body: JSON.stringify({
        action: "permission_change",
        data: {
          user_id: userId,
          permissions: permissions.filter((f)=> f.includes(":")),
        },
      }),
    });
    if (req.status == 200) {
      toast("Permissions changed successfully");
      setOpen(false);
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
        <UserShield />
        <span>Change Permission</span>
      </Button>

      <Dialog onOpenChange={() => setOpen(false)} open={isOpen}>
        <DialogContent className="rounded-2xl bg-secondary text-white">
          <DialogHeader>
            <DialogTitle>Change User Permissions</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col">
            <div>
              <label htmlFor="users">User:</label>
              <select
                className="ring-0 outline-0 rounded-2xl gap-2 p-1"
                id="users"
                onChange={(e) =>
                  fetchSelectedUserPerms(Number(e.target.value))
                }
              >
                {selectableUsers.map((user) => {
                  return (
                    <option
                      className="bg-foreground text-white"
                      value={user.user_id}
                    >
                      {user.username}
                    </option>
                  );
                })}
              </select>
              <hr className="mb-1"></hr>
            </div>
            <div>
              <label>Permissions:</label>
              <div className="grid grid-cols-2">
                {selectablePermissions.map((perm) => {
                  return (
                    <label className="inline-flex gap-3">
                      <input
                        checked={perm.selected}
                        className="ring-0 outline-0 rounded-2xl gap-2 p-1"
                        type="checkbox"
                        id={perm.permission}
                        name={perm.permission}
                        value={perm.permission}
                        key={perm.permission}
                        onChange={(e) => {
                          setSelectablePermissions((prev) =>
                            prev.map((sp) =>
                              sp.permission === e.target.value
                                ? { ...sp, selected: !sp.selected }
                                : sp,
                            ),
                          );
                          setPermissions([...permissions, e.target.value]);
                        }}
                      />
                      <span className="text-white">{perm.permission}</span>
                    </label>
                  );
                })}
              </div>
              <hr className="mb-1"></hr>
            </div>
            <div>
              <Button
                className="cursor-pointer inline-flex p-3"
                variant={"outline"}
                onClick={handle}
              >
                <UserShield />
                Set Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
