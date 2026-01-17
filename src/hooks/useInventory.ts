import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InventoryItem } from "@/types/database";
import { toast } from "sonner";

type InventoryRow = Omit<InventoryItem, 'images'> & { images: string[] | null };

export function useInventory() {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: async (): Promise<InventoryItem[]> => {
      const { data, error } = await (supabase
        .from("inventory" as any)
        .select("*")
        .order("created_at", { ascending: false }) as any);

      if (error) throw error;
      return (data || []).map((item: InventoryRow) => ({
        ...item,
        images: Array.isArray(item.images) ? item.images : []
      })) as InventoryItem[];
    },
  });
}

export function useInventoryItem(id: string) {
  return useQuery({
    queryKey: ["inventory", id],
    queryFn: async (): Promise<InventoryItem | null> => {
      const { data, error } = await (supabase
        .from("inventory" as any)
        .select("*")
        .eq("id", id)
        .maybeSingle() as any);

      if (error) throw error;
      if (!data) return null;
      return {
        ...data,
        images: Array.isArray(data.images) ? data.images : []
      } as InventoryItem;
    },
    enabled: !!id,
  });
}

export function useCreateInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Omit<InventoryItem, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await (supabase
        .from("inventory" as any)
        .insert([item])
        .select()
        .single() as any);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Equipment added successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to add equipment: " + error.message);
    },
  });
}

export function useUpdateInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<InventoryItem> & { id: string }) => {
      const { data, error } = await (supabase
        .from("inventory" as any)
        .update(updates)
        .eq("id", id)
        .select()
        .single() as any);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Equipment updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update equipment: " + error.message);
    },
  });
}

export function useDeleteInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from("inventory" as any).delete().eq("id", id) as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Equipment deleted successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete equipment: " + error.message);
    },
  });
}

type InventoryStatsRow = Pick<InventoryItem, 'availability_status'>;

export function useInventoryStats() {
  return useQuery({
    queryKey: ["inventory-stats"],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("inventory" as any)
        .select("availability_status") as any);

      if (error) throw error;

      const total = data?.length || 0;
      const available = data?.filter((i: InventoryStatsRow) => i.availability_status === "Available").length || 0;
      const sold = data?.filter((i: InventoryStatsRow) => i.availability_status === "Sold").length || 0;
      const reserved = data?.filter((i: InventoryStatsRow) => i.availability_status === "Reserved").length || 0;

      return { total, available, sold, reserved };
    },
  });
}
