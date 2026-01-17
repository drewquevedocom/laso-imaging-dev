import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EquipmentRental } from "@/types/database";
import { toast } from "sonner";

export function useEquipmentRentals() {
  return useQuery({
    queryKey: ["equipment-rentals"],
    queryFn: async (): Promise<EquipmentRental[]> => {
      const { data, error } = await (supabase
        .from("equipment_rentals" as any)
        .select(`
          *,
          inventory:inventory_id (
            id, product_name, oem, modality, serial_number, images
          )
        `)
        .order("start_date", { ascending: false }) as any);

      if (error) throw error;
      return data as EquipmentRental[];
    },
  });
}

export function useRentalsByDateRange(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["equipment-rentals", startDate, endDate],
    queryFn: async (): Promise<EquipmentRental[]> => {
      const { data, error } = await (supabase
        .from("equipment_rentals" as any)
        .select(`
          *,
          inventory:inventory_id (
            id, product_name, oem, modality, serial_number, images
          )
        `)
        .gte("start_date", startDate)
        .lte("end_date", endDate)
        .order("start_date", { ascending: true }) as any);

      if (error) throw error;
      return data as EquipmentRental[];
    },
    enabled: !!startDate && !!endDate,
  });
}

export function useRentalConflicts(inventoryId: string, startDate: string, endDate: string, excludeId?: string) {
  return useQuery({
    queryKey: ["rental-conflicts", inventoryId, startDate, endDate],
    queryFn: async (): Promise<EquipmentRental[]> => {
      let query = supabase
        .from("equipment_rentals" as any)
        .select("*")
        .eq("inventory_id", inventoryId)
        .not("status", "in", '("cancelled","completed")')
        .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`);

      if (excludeId) {
        query = query.not("id", "eq", excludeId);
      }

      const { data, error } = await (query as any);
      if (error) throw error;
      return data as EquipmentRental[];
    },
    enabled: !!inventoryId && !!startDate && !!endDate,
  });
}

export function useCreateRental() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rental: Omit<EquipmentRental, "id" | "created_at" | "updated_at" | "inventory">) => {
      const { data, error } = await (supabase
        .from("equipment_rentals" as any)
        .insert([rental])
        .select()
        .single() as any);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment-rentals"] });
      toast.success("Rental booking created successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to create rental: " + error.message);
    },
  });
}

export function useUpdateRental() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<EquipmentRental> & { id: string }) => {
      const { data, error } = await (supabase
        .from("equipment_rentals" as any)
        .update(updates)
        .eq("id", id)
        .select()
        .single() as any);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment-rentals"] });
      toast.success("Rental updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update rental: " + error.message);
    },
  });
}

export function useDeleteRental() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from("equipment_rentals" as any).delete().eq("id", id) as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment-rentals"] });
      toast.success("Rental cancelled successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to cancel rental: " + error.message);
    },
  });
}

export function useRentalStats() {
  return useQuery({
    queryKey: ["rental-stats"],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("equipment_rentals" as any)
        .select("status, total_amount, start_date, end_date") as any);

      if (error) throw error;

      const now = new Date();
      const thisMonth = now.toISOString().slice(0, 7);
      
      const active = data?.filter((r: any) => r.status === 'active').length || 0;
      const pending = data?.filter((r: any) => r.status === 'pending').length || 0;
      const completed = data?.filter((r: any) => r.status === 'completed').length || 0;
      const totalRevenue = data?.reduce((sum: number, r: any) => sum + (r.total_amount || 0), 0) || 0;
      const monthlyRevenue = data?.filter((r: any) => r.start_date?.startsWith(thisMonth))
        .reduce((sum: number, r: any) => sum + (r.total_amount || 0), 0) || 0;

      return { active, pending, completed, totalRevenue, monthlyRevenue, total: data?.length || 0 };
    },
  });
}

export function useRentableInventory() {
  return useQuery({
    queryKey: ["rentable-inventory"],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("inventory" as any)
        .select("*")
        .eq("is_rental", true)
        .in("availability_status", ["Available", "Reserved"])
        .order("product_name") as any);

      if (error) throw error;
      return data || [];
    },
  });
}
