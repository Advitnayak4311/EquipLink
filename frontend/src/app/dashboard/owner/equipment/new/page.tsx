"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import Breadcrumb from "@/components/common/Breadcrumb";
import EquipmentForm, { EquipmentFormValues } from "@/components/common/EquipmentForm";
import { useCreateEquipment } from "@/lib/api/equipmentService";

import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function NewEquipmentPage() {
  const router = useRouter();
  const createMutation = useCreateEquipment();

  const handleFormSubmit = async (values: EquipmentFormValues) => {
    try {
      await createMutation.mutateAsync({
        name: values.name,
        brand: values.brand,
        model: values.model,
        manufactureYear: values.manufactureYear,
        categoryId: values.categoryId,
        description: values.description,
        dailyRentalPrice: values.dailyRentalPrice,
        location: values.location,
        availabilityStatus: values.availabilityStatus,
        imageUrls: values.imageUrls,
      });
      toast.success("Equipment listed successfully!");
      router.push("/dashboard/owner/equipment");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to list equipment. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "ADMIN"]}>
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-1 flex">
          <Sidebar className="hidden md:flex" />
          <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
            <Breadcrumb />
            
            <div className="mt-4 p-8 bg-card rounded-xl border shadow-sm">
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">List New Equipment</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Provide machinery specs, rental pricing, location, and upload images.
                </p>
              </div>

              <EquipmentForm
                onSubmit={handleFormSubmit}
                isSubmitting={createMutation.isPending}
                submitButtonText="Create Listing"
              />
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
