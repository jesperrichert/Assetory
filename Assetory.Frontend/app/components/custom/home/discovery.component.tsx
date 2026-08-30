import { useContext, useEffect, useState } from "react";
import { SidebarTab } from "./app.component";
import { AuthContext } from "~/context/auth.context";

type Discovery = {
  files: DiscoveryFile[];
  folders: DiscoveryFolder[];
};

type DiscoveryFile = {
  name: string;
};

type DiscoveryFolder = {
  name: string;
  files: DiscoveryFile[];
};

export function Discovery({ tab }: { tab: string }) {
  if (tab != SidebarTab.DISCOVERY) return;

  const authContext = useContext(AuthContext);
  const [discovery, setDiscovery] = useState<Discovery | null>(null);

  useEffect(() => {
    if (discovery != null) return;
    async function f() {
      const data = await fetch("/api/storage", {
        headers: {
          Authorization: authContext?.session ?? "",
        },
      });
      if (data.status != 200) {
        return;
      }
      const json = await data.json();
      setDiscovery(json.data as Discovery);
    }
    f();
  });

  return (
    <div>
      <div>
        <span>Files</span>
        <div>
          {discovery?.files != null
            ? discovery?.files.map((file) => {
                return (
                  <div>
                    <span>{file.name}</span>
                  </div>
                );
              })
            : "No Files"}
        </div>
      </div>

      <div>
        <span>Folders</span>
        <div>
          {discovery?.folders != null
            ? discovery?.folders.map((folder) => {
                return (
                  <div>
                    <span>{folder.name}</span>
                  </div>
                );
              })
            : "No Folders"}
        </div>
      </div>
    </div>
  );
}
