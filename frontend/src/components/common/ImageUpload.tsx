import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { equipmentApi } from "@/lib/api/equipmentService";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxFiles?: number;
}

export default function ImageUpload({
  value = [],
  onChange,
  maxFiles = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (value.length + files.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} images.`);
      return;
    }

    setUploading(true);
    const newUrls = [...value];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Basic size and type validation
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image file.`);
          continue;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} exceeds the 10MB limit.`);
          continue;
        }

        const url = await equipmentApi.uploadTempFile(file);
        newUrls.push(url);
      }
      onChange(newUrls);
      toast.success("Images uploaded successfully!");
    } catch {
      toast.error("Failed to upload one or more images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Previews */}
        {value.map((url) => {
          const displayUrl = url.startsWith("http://") || url.startsWith("https://")
            ? url
            : url.startsWith("/uploads/")
            ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/..${url}`
            : url;
          return (
            <div
              key={url}
              className="relative aspect-square rounded-lg overflow-hidden border bg-muted flex items-center justify-center group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={displayUrl} alt="Equipment preview" className="object-cover w-full h-full" />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-105"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}

        {/* Upload Trigger Button */}
        {value.length < maxFiles && (
          <label className="relative aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors flex flex-col items-center justify-center cursor-pointer p-4 text-center bg-muted/10 hover:bg-muted/20">
            {uploading ? (
              <>
                <Loader2 className="h-6 w-6 text-primary animate-spin mb-2" />
                <span className="text-xs text-muted-foreground font-medium">Uploading…</span>
              </>
            ) : (
              <>
                <Upload className="h-6 w-6 text-muted-foreground/60 mb-2" />
                <span className="text-xs text-muted-foreground font-semibold">Upload Image</span>
                <span className="text-[10px] text-muted-foreground mt-1">Up to 10MB</span>
              </>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              disabled={uploading}
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </div>
  );
}
