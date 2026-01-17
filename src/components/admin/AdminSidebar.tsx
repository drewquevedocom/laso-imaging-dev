import { useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  UserCheck, 
  Package, 
  FileText, 
  MessageSquare, 
  Settings,
  ChevronLeft
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import logoLaso from "@/assets/logo-laso.png";

const navItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Lead Triage", url: "/admin/notifications", icon: UserCheck },
  { title: "Inventory", url: "/admin/inventory", icon: Package },
  { title: "Quotes", url: "/admin/quotes", icon: FileText },
  { title: "Communication", url: "/admin/communication", icon: MessageSquare },
];

const AdminSidebar = () => {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar
      className="border-r-0 bg-[#0F172A]"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-slate-700/50 p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <img src={logoLaso} alt="LASO" className="h-8 w-auto brightness-0 invert" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700/50"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.url)}
                        className={`
                          group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                          ${isActive(item.url) 
                            ? "bg-primary/20 text-white" 
                            : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                          }
                        `}
                      >
                        <NavLink to={item.url} className="flex items-center gap-3 w-full">
                          <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive(item.url) ? "text-primary" : ""}`} />
                          {!isCollapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                        {item.title}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-700/50 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/settings")}
                  className={`
                    group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                    ${isActive("/admin/settings") 
                      ? "bg-primary/20 text-white" 
                      : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                    }
                  `}
                >
                  <NavLink to="/admin/settings" className="flex items-center gap-3 w-full">
                    <Settings className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span>Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                  Settings
                </TooltipContent>
              )}
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
