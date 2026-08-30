import { useContext } from "react";
import { SidebarTab } from "./app.component";
import { AuthContext } from "~/context/auth.context";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { StaticPaths } from "~/lib/routes.lib";

export function Overview({ tab }: { tab: string }) {
  if (tab != SidebarTab.OVERVIEW) return;
  const user = useContext(AuthContext);

  return (
    <div className="flex h-screen p-2">
      <Card className="h-50 w-70 rounded-2xl bg-secondary text-white">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardAction onClick={() => window.open(StaticPaths.LOGOUT, "_self")}>
            Logout
          </CardAction>
        </CardHeader>
        <CardContent>
          <span>Username: {user?.user?.username}</span>
          <br></br>
          <span>Is External: {user?.user?.isOidc ? "OIDC" : "LOCAL"}</span>
        </CardContent>
      </Card>
    </div>
  );
}
