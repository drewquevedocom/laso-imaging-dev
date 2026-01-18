import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Settings as SettingsIcon, User, Bell, Shield, Database, Mail, Volume2, VolumeX } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useHotLeadNotifications } from "@/hooks/useHotLeadNotifications";
import { toast } from "sonner";

interface NotificationPrefs {
  hotLeadAlerts: boolean;
  soundEnabled: boolean;
  browserPushEnabled: boolean;
  quoteResponses: boolean;
  dailyDigest: boolean;
}

const defaultPrefs: NotificationPrefs = {
  hotLeadAlerts: true,
  soundEnabled: true,
  browserPushEnabled: false,
  quoteResponses: true,
  dailyDigest: false,
};

const Settings = () => {
  const { user } = useAdminAuth();
  const { testNotification, pushPermission, requestPushPermission } = useHotLeadNotifications();
  
  const [prefs, setPrefs] = useState<NotificationPrefs>(defaultPrefs);

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("laso-notification-prefs");
      if (stored) {
        setPrefs({ ...defaultPrefs, ...JSON.parse(stored) });
      }
    } catch {
      // Use defaults
    }
  }, []);

  // Save preferences to localStorage
  const updatePref = (key: keyof NotificationPrefs, value: boolean) => {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);
    localStorage.setItem("laso-notification-prefs", JSON.stringify(newPrefs));
    toast.success("Settings saved");
  };

  const handleEnablePush = async () => {
    const granted = await requestPushPermission();
    if (granted) {
      updatePref("browserPushEnabled", true);
    }
  };

  return (
    <>
      <Helmet>
        <title>Settings | LASO Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
              <CardDescription>
                Your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value="Administrator" disabled />
              </div>
              <Button variant="outline" className="w-full">
                Update Password
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure how you receive alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Hot Lead Alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Get notified for high-priority leads
                  </p>
                </div>
                <Switch 
                  checked={prefs.hotLeadAlerts}
                  onCheckedChange={(checked) => updatePref("hotLeadAlerts", checked)}
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {prefs.soundEnabled ? (
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium text-sm">Sound Alerts</p>
                    <p className="text-xs text-muted-foreground">
                      Play audio for notifications
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={prefs.soundEnabled}
                  onCheckedChange={(checked) => updatePref("soundEnabled", checked)}
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Browser Push Notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Receive desktop alerts even when tab is minimized
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {pushPermission === "denied" ? (
                    <Badge variant="destructive" className="text-xs">Blocked</Badge>
                  ) : pushPermission === "granted" ? (
                    <Switch 
                      checked={prefs.browserPushEnabled}
                      onCheckedChange={(checked) => updatePref("browserPushEnabled", checked)}
                    />
                  ) : (
                    <Button size="sm" variant="outline" onClick={handleEnablePush}>
                      Enable
                    </Button>
                  )}
                </div>
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Quote Responses</p>
                  <p className="text-xs text-muted-foreground">
                    Notify when quotes are viewed/accepted
                  </p>
                </div>
                <Switch 
                  checked={prefs.quoteResponses}
                  onCheckedChange={(checked) => updatePref("quoteResponses", checked)}
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Daily Digest</p>
                  <p className="text-xs text-muted-foreground">
                    Daily summary of lead activity
                  </p>
                </div>
                <Switch 
                  checked={prefs.dailyDigest}
                  onCheckedChange={(checked) => updatePref("dailyDigest", checked)}
                />
              </div>
              
              <Separator />
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={testNotification}
              >
                Test Notification
              </Button>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>
                Manage email sending settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>From Email</Label>
                <Input value="info@lasoimaging.com" disabled />
                <p className="text-xs text-muted-foreground">
                  Configured in Resend dashboard
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Email Tracking</p>
                  <p className="text-xs text-muted-foreground">
                    Track opens and clicks
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Information
              </CardTitle>
              <CardDescription>
                Application details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Version</span>
                <span className="font-mono">1.0.0</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Environment</span>
                <span className="font-mono">Production</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Backend</span>
                <span className="font-mono">Lovable Cloud</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SMS Provider</span>
                <span className="font-mono">Telnyx</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Email Provider</span>
                <span className="font-mono">Resend</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Settings;
