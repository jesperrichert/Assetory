import { useContext, useState } from "react";
import { Sidebar1 } from "../navigation/sidebar.component";
import { Discovery } from "./folder-discovery.component";
import { Settings } from "../settings/settings.component";
import { AuthContext } from "~/context/auth.context";
import { PlusIcon } from "lucide-react";
import { CreateContent } from "../actions/create-content.component";

export enum SidebarTab {
  DISCOVERY = "discovery",
  CONTENT = "content",
  CDN = "cdn",
  SETTINGS = "settings",
}
export type SidebarTabValue = "discovery" | "content" | "cdn" | "settings";

export function StaticContent({ tab }: { tab: SidebarTabValue }) {
  if (tab != SidebarTab.CONTENT) return;
  const authContext = useContext(AuthContext);
  const [isCreateOpen, setCreateOpen] = useState<boolean>(false)

  return (
    <div>
      <CreateContent
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
      />
      <div className="p-2">
          <span className="p-2">Static Content</span>
          <span className="flex justify-end items-end text-right p-2">
            <PlusIcon
              className="cursor-pointer"
              onClick={() => setCreateOpen(true)}
            />
          </span>
        </div>
    </div>
  );
}
