import { Helmet } from "react-helmet-async";
import { useIsMobile } from "@/hooks/use-mobile";
import NotificationFeed from "@/components/admin/NotificationFeed";
import MobileNotifications from "@/components/admin/MobileNotifications";
import Header from "@/components/layout/Header";

const AdminNotifications = () => {
  const isMobile = useIsMobile();

  // Mobile view has its own header
  if (isMobile) {
    return (
      <>
        <Helmet>
          <title>Lead Notifications | LASO Admin</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <MobileNotifications />
      </>
    );
  }

  // Desktop view with standard header
  return (
    <>
      <Helmet>
        <title>Lead Notifications | LASO Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-secondary">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <NotificationFeed />
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminNotifications;
