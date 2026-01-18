import { useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  UserCheck, 
  FileText, 
  MessageSquare, 
  Settings,
  ChevronLeft,
  FileEdit,
  Search,
  Users,
  Package,
  MailOpen,
  Calculator,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import logoLasoAdmin from "@/assets/logo-laso-admin.png";
import { useHotList } from "@/hooks/useHotList";

const navGroups = [
  {
    label: "Sales & Leads",
    items: [
      { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard, showHotCount: true },
      { title: "Lead Triage", url: "/admin/notifications", icon: UserCheck },
      { title: "Customers", url: "/admin/customers", icon: Users },
    ]
  },
  {
    label: "Equipment",
    items: [
      { title: "Equipment Hub", url: "/admin/equipment", icon: Package },
      { title: "Product Search", url: "/admin/search", icon: Search },
    ]
  },
  {
    label: "Quotes & Orders",
    items: [
      { title: "Quotes", url: "/admin/quotes", icon: FileText },
      { title: "Quote Builder", url: "/admin/quote-builder", icon: FileEdit },
    ]
  },
  {
    label: "Communication",
    items: [
      { title: "Communication", url: "/admin/communication", icon: MessageSquare },
      { title: "Email Templates", url: "/admin/email-templates", icon: MailOpen },
    ]
  },
  {
    label: "Configuration",
    items: [
      { title: "Pricing Rules", url: "/admin/pricing-rules", icon: Calculator },
    ]
  }
];

const AdminSidebar = () => {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";
  const { count: hotCount } = useHotList();

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
              <img src={logoLasoAdmin} alt="LASO" className="h-[52px] w-auto" />
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
        {navGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.label} className={groupIndex > 0 ? "mt-4" : ""}>
            {!isCollapsed && (
              <SidebarGroupLabel className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.url)}
                          className={`
                            group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                            ${isActive(item.url) 
                              ? "bg-primary/20 text-white" 
                              : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                            }
                          `}
                        >
                          <NavLink to={item.url} className="flex items-center gap-3 w-full">
                            <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive(item.url) ? "text-primary" : ""}`} />
                            {!isCollapsed && <span>{item.title}</span>}
                            {item.showHotCount && hotCount > 0 && (
                              <Badge 
                                className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center text-[10px] p-0 bg-red-500 text-white border-2 border-white shadow-lg font-bold"
                              >
                                {hotCount}
                              </Badge>
                            )}
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
        ))}
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
