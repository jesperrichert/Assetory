import { useContext } from "react";
import { SidebarTab } from "./app";
import { AuthContext } from "~/context/auth.context";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

export function Overview({ tab }: { tab: string }) {
  if (tab != SidebarTab.OVERVIEW) return;

  const user = useContext(AuthContext);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </>
  );
}
