import { useState } from "react";
import { Sidebar1 } from "../ui/sidebar1.component";
import { Discovery } from "./discovery.component";
import { Overview } from "./overview.component";

export enum SidebarTab {
  OVERVIEW = "overview",
  DISCOVERY = "discovery",
}
export type SidebarTabValue = "overview" | "discovery";

export function App() {
  const [tab, setTab] = useState<SidebarTabValue>("overview");

  return (
    <div>
      <div>
        <Sidebar1 onTabSelect={(tab: SidebarTabValue) => setTab(tab)}>
          <Overview tab={tab} />
          <Discovery tab={tab} />
        </Sidebar1>
      </div>
    </div>
  );
}
