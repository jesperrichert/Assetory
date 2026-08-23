import {
  BookSearch, LayoutDashboard,
  LogOut
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger
} from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";
import { SidebarTab, type SidebarTabValue } from "../home/app";

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
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          tab: "overview",
        },
        { label: "Discovery", icon: BookSearch, tab: "discovery" },
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
    <Sidebar>
      <SidebarContent>
        {sidebarData.navGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem
                    className="cursor-pointer"
                    onClick={() => onTabSelect(item.tab ?? SidebarTab.OVERVIEW)}
                    key={item.label}
                  >
                    <SidebarMenuButton>
                      <item.icon></item.icon>
                      <button>{item.label}</button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>{sidebarData.footerGroup.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarData.footerGroup.items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton>
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
        <SidebarTrigger></SidebarTrigger>
        {children}
      </SidebarProvider>
    </>
  );
};

export { Sidebar1 };
