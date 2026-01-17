import { Helmet } from "react-helmet-async";
import { useIsMobile } from "@/hooks/use-mobile";
import NotificationFeed from "@/components/admin/NotificationFeed";
import MobileNotifications from "@/components/admin/MobileNotifications";

const AdminNotifications = () => {
  const isMobile = useIsMobile();

  // Mobile view has its own header
  if (isMobile) {
    return (
      <>
        <Helmet>
          <title>Lead Triage | LASO Admin</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <MobileNotifications />
      </>
    );
  }

  // Desktop view - uses AdminDashboardLayout (no separate header needed)
  return (
    <>
      <Helmet>
        <title>Lead Triage | LASO Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lead Triage</h1>
          <p className="text-muted-foreground">
            Manage and respond to incoming leads
          </p>
        </div>
        
        <div className="max-w-3xl">
          <NotificationFeed />
        </div>
      </div>
    </>
  );
};

export default AdminNotifications;
