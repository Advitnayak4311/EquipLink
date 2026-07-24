"use client";

import { useState } from "react";
import { Upload, Video, Link as LinkIcon, X, Loader2, Play, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { equipmentApi } from "@/lib/api/equipmentService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideoUploadProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function VideoUpload({ value = "", onChange }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value);

  const displayUrl = value
    ? value.startsWith("http://") || value.startsWith("https://")
      ? value
      : value.startsWith("/uploads/")
      ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/..${value}`
      : value
    : "";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file (MP4, WebM, MOV).");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error(`${file.name} exceeds the 50MB size limit.`);
      return;
    }

    setUploading(true);
    try {
      const uploadedUrl = await equipmentApi.uploadTempFile(file);
      onChange(uploadedUrl);
      setUrlInput(uploadedUrl);
      toast.success("Walkthrough video uploaded successfully!");
    } catch {
      toast.error("Failed to upload video file. Please try again or paste a video URL.");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast.error("Please enter a valid video URL.");
      return;
    }
    onChange(urlInput.trim());
    toast.success("Video URL set successfully!");
  };

  const handleRemove = () => {
    onChange("");
    setUrlInput("");
    toast.info("Video removed.");
  };

  return (
    <div className="space-y-3 font-sans">
      {/* Video Preview Player if set */}
      {value ? (
        <div className="relative rounded-xl border bg-black overflow-hidden shadow-sm group">
          <video
            src={displayUrl}
            controls
            className="w-full h-48 object-cover"
            poster="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop"
          />
          <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full border shadow-xs text-xs font-semibold text-foreground flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Inspection Video Ready</span>
          </div>
          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={handleRemove}
            className="absolute top-3 right-3 h-8 w-8 rounded-full shadow-md hover:scale-105 transition-transform"
            title="Remove Video"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        /* Tab Selector for File Upload vs URL */
        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid grid-cols-2 bg-muted border text-xs h-9">
            <TabsTrigger value="file" className="data-[state=active]:bg-background data-[state=active]:font-bold text-xs">
              <Upload className="w-3.5 h-3.5 mr-1.5" /> 📁 Upload Video File
            </TabsTrigger>
            <TabsTrigger value="url" className="data-[state=active]:bg-background data-[state=active]:font-bold text-xs">
              <LinkIcon className="w-3.5 h-3.5 mr-1.5" /> 🔗 External Video URL
            </TabsTrigger>
          </TabsList>

          {/* Option 1: Direct File Upload */}
          <TabsContent value="file" className="pt-2">
            <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors rounded-xl cursor-pointer bg-background hover:bg-muted/10 text-center">
              {uploading ? (
                <div className="flex flex-col items-center space-y-2 py-2">
                  <Loader2 className="h-7 w-7 text-primary animate-spin" />
                  <span className="text-xs text-foreground font-bold">Uploading Machinery Walkthrough Video…</span>
                  <span className="text-[10px] text-muted-foreground">Please wait while the file is processed</span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2 py-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Video className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Click or Drag & Drop Video File</p>
                    <p className="text-[10px] text-muted-foreground">Supports MP4, WebM, MOV up to 50MB</p>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="video/*"
                disabled={uploading}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </TabsContent>

          {/* Option 2: External Video URL */}
          <TabsContent value="url" className="pt-2">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Paste video URL (e.g. https://domain.com/video.mp4 or Drive link)"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="text-xs bg-background"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleUrlSubmit}
                className="text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground px-4 shrink-0"
              >
                Set URL
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
