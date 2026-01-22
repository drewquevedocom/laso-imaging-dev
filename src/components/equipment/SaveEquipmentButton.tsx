import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSavedEquipment } from "@/hooks/useSavedEquipment";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SaveEquipmentButtonProps {
  productId: string;
  productName: string;
  productData?: {
    image?: string;
    price?: number;
    handle?: string;
  };
  variant?: "icon" | "button";
  className?: string;
}

const SaveEquipmentButton = ({
  productId,
  productName,
  productData,
  variant = "icon",
  className,
}: SaveEquipmentButtonProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useCustomerAuth();
  const { isEquipmentSaved, saveEquipment, removeEquipment, savedItems } = useSavedEquipment();
  const [isSaving, setIsSaving] = useState(false);

  const isSaved = isEquipmentSaved({ shopifyProductId: productId });
  const savedItem = savedItems.find((item) => item.shopify_product_id === productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Sign in to save equipment", {
        action: {
          label: "Sign In",
          onClick: () => navigate("/auth/customer"),
        },
      });
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved && savedItem) {
        await removeEquipment(savedItem.id);
      } else {
        await saveEquipment({
          shopifyProductId: productId,
          productName,
          productData,
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        disabled={isSaving}
        className={cn(
          "rounded-full hover:bg-accent/10 transition-all",
          isSaving && "opacity-50",
          className
        )}
        aria-label={isSaved ? "Remove from saved" : "Save equipment"}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-colors",
            isSaved ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500"
          )}
        />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={isSaving}
      className={cn(className)}
    >
      <Heart
        className={cn(
          "h-4 w-4 mr-2 transition-colors",
          isSaved ? "fill-red-500 text-red-500" : ""
        )}
      />
      {isSaved ? "Saved" : "Save Equipment"}
    </Button>
  );
};

export default SaveEquipmentButton;
