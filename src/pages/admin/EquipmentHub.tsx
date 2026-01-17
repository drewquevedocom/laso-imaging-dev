import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Boxes, Calendar, BarChart3 } from "lucide-react";
import SellRequests from "./SellRequests";
import AdminInventory from "./Inventory";
import { RentalCalendarTab } from "@/components/admin/equipment/RentalCalendarTab";
import { AnalyticsTab } from "@/components/admin/equipment/AnalyticsTab";

export default function EquipmentHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "acquisitions";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <>
      <Helmet>
        <title>Equipment Hub | LASO Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Equipment Hub</h1>
          <p className="text-muted-foreground">
            Manage acquisitions, inventory, rentals, and analytics
          </p>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="acquisitions" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Acquisitions</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="gap-2">
              <Boxes className="h-4 w-4" />
              <span className="hidden sm:inline">Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="rentals" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Rentals</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="acquisitions" className="mt-6">
            <SellRequests />
          </TabsContent>

          <TabsContent value="inventory" className="mt-6">
            <AdminInventory />
          </TabsContent>

          <TabsContent value="rentals" className="mt-6">
            <RentalCalendarTab />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
