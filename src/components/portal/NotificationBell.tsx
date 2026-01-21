import { useState } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCustomerNotifications } from "@/hooks/useCustomerNotifications";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

export const NotificationBell = () => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead,
    permissionGranted,
    requestPermission,
  } = useCustomerNotifications();
  const [open, setOpen] = useState(false);

  const getNotificationLink = (notification: { type: string; data: Record<string, unknown> | null }) => {
    const data = notification.data as Record<string, string> | null;
    switch (notification.type) {
      case "quote_sent":
      case "quote_accepted":
        return data?.quote_id ? `/portal/quotes` : "/portal/quotes";
      case "order_update":
        return "/portal/orders";
      case "message_received":
        return "/portal/messages";
      default:
        return "/portal";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "quote_sent":
      case "quote_accepted":
        return "📄";
      case "order_update":
        return "📦";
      case "message_received":
        return "💬";
      default:
        return "🔔";
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <span className="font-semibold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                markAllAsRead();
              }}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {!permissionGranted && (
          <div className="px-3 py-2 bg-muted/50 border-b">
            <p className="text-xs text-muted-foreground mb-2">
              Enable push notifications to stay updated
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full h-7 text-xs"
              onClick={requestPermission}
            >
              Enable Notifications
            </Button>
          </div>
        )}

        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.slice(0, 10).map((notification) => (
              <DropdownMenuItem key={notification.id} asChild>
                <Link
                  to={getNotificationLink(notification)}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id);
                    }
                    setOpen(false);
                  }}
                  className={`flex items-start gap-3 p-3 cursor-pointer ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                >
                  <span className="text-lg flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.read ? "font-medium" : ""}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.body}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  )}
                </Link>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            to="/portal/notifications"
            className="w-full text-center text-sm text-primary justify-center"
            onClick={() => setOpen(false)}
          >
            View All Notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
