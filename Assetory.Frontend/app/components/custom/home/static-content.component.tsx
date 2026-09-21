import { useContext, useState } from "react";
import { Sidebar1 } from "../navigation/sidebar.component";
import { Discovery } from "./folder-discovery.component";
import { Settings } from "../settings/settings.component";
import { AuthContext } from "~/context/auth.context";

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

  return (
    <div>
      Content
    </div>
  );
}
