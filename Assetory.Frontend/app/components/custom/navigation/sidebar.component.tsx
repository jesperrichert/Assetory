import {
  AppWindowIcon,
  BookSearch,
  FolderSearch,
  LayoutDashboard,
  LogOut,
  NetworkIcon,
  SettingsIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { cn } from "~/lib/utils.lib";
import { SidebarTab, type SidebarTabValue } from "../home/app.component";

type NavItem = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tab?: SidebarTabValue;
  href?: string;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

type SidebarData = {
  navGroups: NavGroup[];
  footerGroup: NavGroup;
};

const sidebarData: SidebarData = {
  navGroups: [
    {
      title: "Assetory",
      items: [
        { label: "Folder Discovery", icon: FolderSearch, tab: "discovery" },
        { label: "Static Pages", icon: AppWindowIcon, tab: "pages" },
        { label: "CDN", icon: NetworkIcon, tab: "cdn" },
        { label: "Settings", icon: SettingsIcon, tab: "settings" },
      ],
    },
  ],
  footerGroup: {
    title: "User",
    items: [{ label: "Logout", icon: LogOut, href: "/auth/logout" }],
  },
};

const AppSidebar = ({
  onTabSelect,
}: {
  onTabSelect: (tab: SidebarTabValue) => void;
}) => {
  return (
    <Sidebar className="bg-secondary text-white">
      <SidebarContent className="bg-secondary text-white">
        {sidebarData.navGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-white">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem
                    onClick={() => onTabSelect(item.tab ?? SidebarTab.DISCOVERY)}
                    key={item.label}
                  >
                    <SidebarMenuButton className="cursor-pointer">
                      <item.icon></item.icon>
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="bg-secondary text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">
            {sidebarData.footerGroup.title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarData.footerGroup.items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    onClick={() => window.open(item.href, "_self")}
                  >
                    <a href={item.href}>{item.label}</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

interface Sidebar1Props {
  children: React.ReactNode;
  className?: string;
  onTabSelect: (tab: SidebarTabValue) => void;
}

const Sidebar1 = ({ children, className, onTabSelect }: Sidebar1Props) => {
  return (
    <>
      <SidebarProvider className={cn(className)}>
        <AppSidebar onTabSelect={onTabSelect} />
        <SidebarTrigger className="p-2 size-2 w-10 h-10"></SidebarTrigger>
        {children}
      </SidebarProvider>
    </>
  );
};

export { Sidebar1 };
