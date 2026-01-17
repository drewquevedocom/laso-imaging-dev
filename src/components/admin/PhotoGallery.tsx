import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Camera, Upload, Trash2, X, Download, ZoomIn, Image as ImageIcon } from "lucide-react";

interface PhotoGalleryProps {
  sellRequestId: string;
}

interface EquipmentImage {
  id: string;
  file_url: string;
  file_name: string | null;
  image_type: string;
  caption: string | null;
  created_at: string;
}

const IMAGE_TYPES = [
  { value: "general", label: "General" },
  { value: "console", label: "Console/Workstation" },
  { value: "serial", label: "Serial Plate" },
  { value: "condition", label: "Condition/Damage" },
  { value: "coil", label: "Coil Cabinet" },
  { value: "cold-head", label: "Cold Head Display" },
  { value: "exterior", label: "Exterior View" },
];

export function PhotoGallery({ sellRequestId }: PhotoGalleryProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<EquipmentImage | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [imageType, setImageType] = useState("general");
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: images, isLoading } = useQuery({
    queryKey: ["equipment-images", sellRequestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipment_images")
        .select("*")
        .eq("sell_request_id", sellRequestId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as EquipmentImage[];
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!uploadFile) throw new Error("No file selected");

      setIsUploading(true);

      // Upload to storage
      const fileExt = uploadFile.name.split(".").pop();
      const fileName = `${sellRequestId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("equipment-photos")
        .upload(fileName, uploadFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("equipment-photos")
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase
        .from("equipment_images")
        .insert({
          sell_request_id: sellRequestId,
          file_url: urlData.publicUrl,
          file_name: uploadFile.name,
          image_type: imageType,
          caption: caption || null,
        });

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      toast.success("Image uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["equipment-images", sellRequestId] });
      setIsUploadOpen(false);
      setUploadFile(null);
      setImageType("general");
      setCaption("");
    },
    onError: (error) => {
      toast.error("Failed to upload image: " + error.message);
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const { error } = await supabase
        .from("equipment_images")
        .delete()
        .eq("id", imageId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Image deleted");
      queryClient.invalidateQueries({ queryKey: ["equipment-images", sellRequestId] });
      setSelectedImage(null);
    },
    onError: () => {
      toast.error("Failed to delete image");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setUploadFile(file);
    }
  };

  const getTypeLabel = (type: string) => {
    return IMAGE_TYPES.find((t) => t.value === type)?.label || type;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium flex items-center gap-2">
          <Camera className="h-4 w-4" />
          Equipment Photos ({images?.length || 0})
        </h4>
        <Button size="sm" onClick={() => setIsUploadOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>

      {images && images.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square rounded-lg overflow-hidden border bg-muted cursor-pointer group"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.file_url}
                alt={image.caption || image.file_name || "Equipment photo"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ZoomIn className="h-6 w-6 text-white" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                {getTypeLabel(image.image_type)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg text-muted-foreground">
          <ImageIcon className="h-8 w-8 mb-2" />
          <p className="text-sm">No photos uploaded yet</p>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Equipment Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Photo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1"
              />
              {uploadFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {uploadFile.name}
                </p>
              )}
            </div>

            <div>
              <Label>Image Type</Label>
              <Select value={imageType} onValueChange={setImageType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {IMAGE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Caption (optional)</Label>
              <Input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a description..."
                className="mt-1"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => uploadMutation.mutate()}
                disabled={!uploadFile || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedImage?.caption || getTypeLabel(selectedImage?.image_type || "")}</span>
            </DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <img
                src={selectedImage.file_url}
                alt={selectedImage.caption || "Equipment photo"}
                className="w-full max-h-[60vh] object-contain rounded-lg"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Type: {getTypeLabel(selectedImage.image_type)}</span>
                <span>
                  Uploaded: {new Date(selectedImage.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(selectedImage.file_url, "_blank")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(selectedImage.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
