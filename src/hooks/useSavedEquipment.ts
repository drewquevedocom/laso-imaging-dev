import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAuth } from "./useCustomerAuth";
import { useToast } from "./use-toast";

interface SavedEquipment {
  id: string;
  customer_id: string;
  inventory_id: string | null;
  shopify_product_id: string | null;
  product_name: string;
  product_data: Record<string, unknown> | null;
  notes: string | null;
  created_at: string;
}

export const useSavedEquipment = () => {
  const { profile, isAuthenticated } = useCustomerAuth();
  const { toast } = useToast();
  const [savedItems, setSavedItems] = useState<SavedEquipment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedEquipment = useCallback(async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from("customer_saved_equipment")
        .select("*")
        .eq("customer_id", profile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSavedItems(data as SavedEquipment[]);
    } catch (error) {
      console.error("Error fetching saved equipment:", error);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    if (isAuthenticated && profile?.id) {
      fetchSavedEquipment();
    }
  }, [isAuthenticated, profile?.id, fetchSavedEquipment]);

  const saveEquipment = useCallback(async (params: {
    inventoryId?: string;
    shopifyProductId?: string;
    productName: string;
    productData?: Record<string, unknown>;
  }) => {
    if (!profile?.id) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to save equipment.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const insertData: {
        customer_id: string;
        product_name: string;
        inventory_id?: string;
        shopify_product_id?: string;
        product_data?: Record<string, unknown>;
      } = {
        customer_id: profile.id,
        product_name: params.productName,
      };

      if (params.inventoryId) {
        insertData.inventory_id = params.inventoryId;
      }
      if (params.shopifyProductId) {
        insertData.shopify_product_id = params.shopifyProductId;
      }
      if (params.productData) {
        insertData.product_data = params.productData;
      }

      const { error } = await supabase
        .from("customer_saved_equipment")
        .insert([insertData] as never);

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already Saved",
            description: "This equipment is already in your saved list.",
          });
          return false;
        }
        throw error;
      }

      toast({
        title: "Equipment Saved!",
        description: "Added to your saved equipment list.",
      });

      fetchSavedEquipment();
      return true;
    } catch (error) {
      console.error("Error saving equipment:", error);
      toast({
        title: "Error",
        description: "Failed to save equipment. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [profile?.id, toast, fetchSavedEquipment]);

  const removeEquipment = useCallback(async (savedId: string) => {
    try {
      const { error } = await supabase
        .from("customer_saved_equipment")
        .delete()
        .eq("id", savedId);

      if (error) throw error;

      setSavedItems(prev => prev.filter(item => item.id !== savedId));
      
      toast({
        title: "Removed",
        description: "Equipment removed from saved list.",
      });

      return true;
    } catch (error) {
      console.error("Error removing equipment:", error);
      toast({
        title: "Error",
        description: "Failed to remove equipment.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const isEquipmentSaved = useCallback((params: {
    inventoryId?: string;
    shopifyProductId?: string;
  }) => {
    return savedItems.some(item => 
      (params.inventoryId && item.inventory_id === params.inventoryId) ||
      (params.shopifyProductId && item.shopify_product_id === params.shopifyProductId)
    );
  }, [savedItems]);

  return {
    savedItems,
    loading,
    saveEquipment,
    removeEquipment,
    isEquipmentSaved,
    refetch: fetchSavedEquipment,
  };
};
