import { useState } from "react";
import { Sidebar1 } from "../navigation/sidebar.component";
import { Discovery } from "./folder-discovery.component";
import { Settings } from "../settings/settings.component";

export enum SidebarTab {
  DISCOVERY = "discovery",
  PAGES = "pages",
  CDN = "cdn",
  SETTINGS = "settings",
}
export type SidebarTabValue = "discovery" | "pages" | "cdn" | "settings";

export function App() {
  const [tab, setTab] = useState<SidebarTabValue>("discovery");

  return (
    <div>
      <div>
        <Sidebar1 onTabSelect={(tab: SidebarTabValue) => setTab(tab)}>
          <Discovery tab={tab} />
          <Settings tab={tab} />
        </Sidebar1>
      </div>
    </div>
  );
}
