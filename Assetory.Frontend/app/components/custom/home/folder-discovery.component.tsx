import {
  PlusIcon
} from "lucide-react";
import {
  useContext,
  useEffect,
  useState
} from "react";
import { AuthContext } from "~/context/auth.context";
import { UploadDialog } from "../actions/upload.component";
import { FolderDiscovery } from "../discovery/folder.component";
import { SidebarTab } from "./app.component";

type Discovery = {
  folders: DiscoveryFolder[];
};

export type DiscoveryFile = {
  name: string;
};

export type DiscoveryFolder = {
  name: string;
  files: DiscoveryFile[];
};

export function Discovery({ tab }: { tab: string }) {
  if (tab != SidebarTab.DISCOVERY) return;

  const authContext = useContext(AuthContext);
  const [discovery, setDiscovery] = useState<Discovery | null>(null);
  const [isUploadOpen, setUploadOpen] = useState<boolean>(false);

  const refresh = async () => {
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
  };

  useEffect(() => {
    if (discovery != null) return;
    refresh();
  });

  return (
    <div>
      <UploadDialog
        refresh={() => refresh()}
        isOpen={isUploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Create a new Project Folder"
      />
      <div className="p-2">
        <div>
          <span className="p-2">Project Folders</span>
          <span className="flex justify-end items-end text-right p-2">
            <PlusIcon
              className="cursor-pointer"
              onClick={() => setUploadOpen(true)}
            />
          </span>
        </div>

        <FolderDiscovery
          refresh={() => refresh()}
          folders={discovery?.folders ?? []}
        />
      </div>
    </div>
  );
}
