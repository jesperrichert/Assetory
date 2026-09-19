import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { AdminSettings } from "./admin.component";
import { ApplicationSettings } from "./application.component";
import { UserSettings } from "./user.component";
import { AuthContext } from "~/context/auth.context";
import { useContext } from "react";
import { SidebarTab } from "../home/app.component";

export enum SettingsTab {
  USER = "user",
  APPLICATION = "application",
  ADMIN = "admin",
}
export type SettingsTabValue = "user" | "application" | "admin";

export function Settings({ tab }: { tab: string }) {
  if (tab != SidebarTab.SETTINGS) return;
  const authContext = useContext(AuthContext);

  return (
    <>
      <Tabs defaultValue="user" className="w-full p-3">
        <TabsList>
          {Object.values(SettingsTab).map((tab) => {
            if (!authContext?.user?.permissions.includes("settings:" + tab))
              return;

            return (
              <TabsTrigger className="cursor-pointer" value={tab.toLowerCase()}>
                {tab.charAt(0).toUpperCase() +
                  tab.slice(1, tab.length).toLowerCase()}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <TabsContent value={SettingsTab.USER}>
          <UserSettings />
        </TabsContent>
        <TabsContent value={SettingsTab.APPLICATION}>
          <ApplicationSettings />
        </TabsContent>
        <TabsContent value={SettingsTab.ADMIN}>
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </>
  );
}
