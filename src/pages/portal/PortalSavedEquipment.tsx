import { Heart, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSavedEquipment } from "@/hooks/useSavedEquipment";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const PortalSavedEquipment = () => {
  const { savedItems, loading, removeEquipment } = useSavedEquipment();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Saved Equipment</h1>
        <p className="text-muted-foreground">
          {savedItems.length} item{savedItems.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {savedItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-1">No Saved Equipment</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Browse our inventory and save equipment you're interested in for quick access later.
            </p>
            <Link to="/equipment">
              <Button>Browse Equipment</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedItems.map((item) => {
            const productData = item.product_data as Record<string, unknown> | null;
            const imageUrl = (productData?.image as string) || "/placeholder.svg";
            const price = productData?.price as number | undefined;
            const handle = productData?.handle as string | undefined;

            return (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  <img
                    src={imageUrl}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => removeEquipment(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold line-clamp-2 mb-2">{item.product_name}</h3>
                  
                  {price && (
                    <p className="text-lg font-bold text-primary mb-2">
                      ${price.toLocaleString()}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground mb-4">
                    Saved {format(new Date(item.created_at), "MMM d, yyyy")}
                  </p>

                  {item.notes && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {item.notes}
                    </p>
                  )}

                  <div className="flex gap-2">
                    {handle && (
                      <Link to={`/products/${handle}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    )}
                    <Link to="/quote" className="flex-1">
                      <Button size="sm" className="w-full">
                        Request Quote
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PortalSavedEquipment;
