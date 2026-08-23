import { SidebarTab } from "./app";

export function Discovery({ tab }: { tab: string }) {
  if (tab != SidebarTab.DISCOVERY) return;

  return <>Discovery</>;
}
