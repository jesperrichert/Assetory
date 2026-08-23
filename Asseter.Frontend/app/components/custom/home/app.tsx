import { useContext, useState } from "react";
import { AuthContext } from "~/context/auth.context";
import Cookies from "js-cookie";
import { Sidebar1 } from "../ui/sidebar1";
import { Overview } from "./overview";
import { Discovery } from "./discovery";

export enum SidebarTab {
  OVERVIEW = "overview",
  DISCOVERY = "discovery",
}
export type SidebarTabValue = "overview" | "discovery" | "/auth/logout";

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
