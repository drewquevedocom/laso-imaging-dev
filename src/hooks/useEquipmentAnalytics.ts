import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subWeeks, startOfWeek, endOfWeek } from "date-fns";

export function useAcquisitionMetrics() {
  return useQuery({
    queryKey: ["acquisition-metrics"],
    queryFn: async () => {
      const { data: requests, error } = await supabase
        .from("equipment_sell_requests")
        .select("status, created_at, deal_priority, has_mri, has_ct, is_mobile");

      if (error) throw error;

      const total = requests?.length || 0;
      const pending = requests?.filter(r => r.status === 'pending').length || 0;
      const evaluating = requests?.filter(r => r.status === 'evaluating').length || 0;
      const closed = requests?.filter(r => r.status === 'closed').length || 0;
      const declined = requests?.filter(r => r.status === 'declined').length || 0;
      const urgent = requests?.filter(r => r.deal_priority === 'urgent').length || 0;
      const conversionRate = total > 0 ? ((closed / total) * 100).toFixed(1) : 0;

      // By modality
      const mri = requests?.filter(r => r.has_mri).length || 0;
      const ct = requests?.filter(r => r.has_ct).length || 0;
      const mobile = requests?.filter(r => r.is_mobile).length || 0;

      return {
        total,
        pending,
        evaluating,
        closed,
        declined,
        urgent,
        conversionRate,
        mri,
        ct,
        mobile,
      };
    },
  });
}

export function useAcquisitionsByWeek() {
  return useQuery({
    queryKey: ["acquisitions-by-week"],
    queryFn: async () => {
      const weeks = [];
      for (let i = 5; i >= 0; i--) {
        const weekStart = startOfWeek(subWeeks(new Date(), i));
        const weekEnd = endOfWeek(subWeeks(new Date(), i));
        weeks.push({
          start: format(weekStart, "yyyy-MM-dd"),
          end: format(weekEnd, "yyyy-MM-dd"),
          label: format(weekStart, "MMM d"),
        });
      }

      const { data, error } = await supabase
        .from("equipment_sell_requests")
        .select("created_at")
        .gte("created_at", weeks[0].start);

      if (error) throw error;

      return weeks.map(week => {
        const count = data?.filter(r => {
          const date = r.created_at.split("T")[0];
          return date >= week.start && date <= week.end;
        }).length || 0;

        return { week: week.label, requests: count };
      });
    },
  });
}

export function useInventoryMetrics() {
  return useQuery({
    queryKey: ["inventory-metrics"],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("inventory" as any)
        .select("availability_status, modality, oem, price, is_rental, created_at") as any);

      if (error) throw error;

      const total = data?.length || 0;
      const available = data?.filter((i: any) => i.availability_status === 'Available').length || 0;
      const sold = data?.filter((i: any) => i.availability_status === 'Sold').length || 0;
      const reserved = data?.filter((i: any) => i.availability_status === 'Reserved').length || 0;
      const rentable = data?.filter((i: any) => i.is_rental).length || 0;
      const totalValue = data?.reduce((sum: number, i: any) => sum + (i.price || 0), 0) || 0;

      // By modality
      const byModality = data?.reduce((acc: Record<string, number>, item: any) => {
        const modality = item.modality || 'Other';
        acc[modality] = (acc[modality] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // By OEM
      const byOem = data?.reduce((acc: Record<string, number>, item: any) => {
        const oem = item.oem || 'Other';
        acc[oem] = (acc[oem] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const utilizationRate = total > 0 ? (((total - available) / total) * 100).toFixed(1) : 0;

      return {
        total,
        available,
        sold,
        reserved,
        rentable,
        totalValue,
        byModality: Object.entries(byModality).map(([name, value]) => ({ name, value })),
        byOem: Object.entries(byOem).map(([name, value]) => ({ name, value })),
        utilizationRate,
      };
    },
  });
}

export function useRentalMetrics() {
  return useQuery({
    queryKey: ["rental-metrics"],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("equipment_rentals" as any)
        .select("status, total_amount, start_date, end_date, customer_name") as any);

      if (error) throw error;

      const now = new Date();
      const today = format(now, "yyyy-MM-dd");
      const nextWeek = format(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd");
      const thisMonth = now.toISOString().slice(0, 7);

      const active = data?.filter((r: any) => r.status === 'active').length || 0;
      const pending = data?.filter((r: any) => r.status === 'pending').length || 0;
      const completed = data?.filter((r: any) => r.status === 'completed').length || 0;
      
      const totalRevenue = data?.reduce((sum: number, r: any) => sum + (r.total_amount || 0), 0) || 0;
      const monthlyRevenue = data?.filter((r: any) => r.start_date?.startsWith(thisMonth))
        .reduce((sum: number, r: any) => sum + (r.total_amount || 0), 0) || 0;

      // Upcoming returns (rentals ending in the next 7 days)
      const upcomingReturns = data?.filter((r: any) => {
        return r.status === 'active' && r.end_date >= today && r.end_date <= nextWeek;
      }) || [];

      // Calculate average duration
      const completedRentals = data?.filter((r: any) => r.status === 'completed' && r.start_date && r.end_date);
      const avgDuration = completedRentals?.length > 0
        ? completedRentals.reduce((sum: number, r: any) => {
            const start = new Date(r.start_date);
            const end = new Date(r.end_date);
            return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          }, 0) / completedRentals.length
        : 0;

      return {
        active,
        pending,
        completed,
        totalRevenue,
        monthlyRevenue,
        upcomingReturns,
        avgDuration: Math.round(avgDuration),
        total: data?.length || 0,
      };
    },
  });
}

export function useRentalsByMonth() {
  return useQuery({
    queryKey: ["rentals-by-month"],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("equipment_rentals" as any)
        .select("start_date, total_amount")
        .not("status", "eq", "cancelled") as any);

      if (error) throw error;

      // Group by month for the last 6 months
      const months: Record<string, { count: number; revenue: number }> = {};
      const now = new Date();

      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = format(monthDate, "yyyy-MM");
        const monthLabel = format(monthDate, "MMM");
        months[monthKey] = { count: 0, revenue: 0 };
      }

      data?.forEach((rental: any) => {
        if (rental.start_date) {
          const monthKey = rental.start_date.slice(0, 7);
          if (months[monthKey]) {
            months[monthKey].count++;
            months[monthKey].revenue += rental.total_amount || 0;
          }
        }
      });

      return Object.entries(months).map(([month, data]) => ({
        month: format(new Date(month + "-01"), "MMM"),
        rentals: data.count,
        revenue: data.revenue,
      }));
    },
  });
}
