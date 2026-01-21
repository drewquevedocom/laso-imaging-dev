import { useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  Wrench, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  Heart,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { NotificationBell } from "@/components/portal/NotificationBell";
import { Loader2 } from "lucide-react";

const navItems = [
  { path: "/portal", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/portal/quotes", label: "My Quotes", icon: FileText },
  { path: "/portal/orders", label: "My Orders", icon: Package },
  { path: "/portal/saved", label: "Saved Equipment", icon: Heart },
  { path: "/portal/messages", label: "Messages", icon: MessageSquare },
  { path: "/portal/services", label: "Service History", icon: Wrench },
  { path: "/portal/documents", label: "Documents", icon: FileText },
  { path: "/portal/settings", label: "Settings", icon: Settings },
];

const CustomerPortal = () => {
  const { user, profile, loading, isAuthenticated, signOut } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth/customer");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const NavContent = () => (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path, item.exact);
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
      
      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <LogOut className="h-5 w-5" />
        <span className="font-medium">Sign Out</span>
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-4">
                <div className="mb-6">
                  <h2 className="font-bold text-lg text-foreground">Customer Portal</h2>
                </div>
                <NavContent />
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/logo-laso.png" 
                alt="LASO Medical" 
                className="h-8"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="font-bold text-xl text-foreground">Customer Portal</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">
                {profile?.contact_name || user?.email}
              </p>
              <p className="text-xs text-muted-foreground">
                {profile?.company_name || "Customer"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">
                {(profile?.contact_name || user?.email || "U")[0].toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-card border border-border rounded-xl p-4 sticky top-24">
            <NavContent />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <Outlet context={{ user, profile }} />
        </main>
      </div>
    </div>
  );
};

export default CustomerPortal;
