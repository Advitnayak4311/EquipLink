"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import Breadcrumb from "@/components/common/Breadcrumb";
import EquipmentForm, { EquipmentFormValues } from "@/components/common/EquipmentForm";
import Loader from "@/components/common/Loader";
import { useEquipment, useUpdateEquipment } from "@/lib/api/equipmentService";

import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function EditEquipmentPage() {
  const router = useRouter();
  const params = useParams();
  const idStr = params.id as string;
  const id = Number(idStr);

  // Queries & Mutations
  const { data: equipment, isLoading: loadingEquipment, error } = useEquipment(id);
  const updateMutation = useUpdateEquipment();

  const handleFormSubmit = async (values: EquipmentFormValues) => {
    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          name: values.name,
          brand: values.brand,
          model: values.model,
          manufactureYear: values.manufactureYear,
          categoryId: values.categoryId,
          description: values.description,
          dailyRentalPrice: values.dailyRentalPrice,
          location: values.location,
          availabilityStatus: values.availabilityStatus,
        },
      });
      toast.success("Equipment listed updated successfully!");
      router.push("/dashboard/owner/equipment");
    } catch {
      toast.error("Failed to update equipment details.");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["OWNER", "ADMIN"]}>
      {loadingEquipment ? (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <Loader label="Loading listing details..." />
          </main>
          <Footer />
        </div>
      ) : error || !equipment ? (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center p-8 bg-card rounded-xl border max-w-md">
              <h3 className="text-lg font-bold text-destructive mb-2">Error Loading Listing</h3>
              <p className="text-muted-foreground text-sm mb-4">
                The requested machinery listing could not be found or you do not have permission to view it.
              </p>
              <button
                onClick={() => router.back()}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Go Back
              </button>
            </div>
          </main>
          <Footer />
        </div>
      ) : (
        <div className="flex flex-col min-h-screen bg-background">
          <Navbar />
          <div className="flex-1 flex">
            <Sidebar className="hidden md:flex" />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
              <Breadcrumb />

              <div className="mt-4 p-8 bg-card rounded-xl border shadow-sm">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold tracking-tight">Edit Equipment Listing</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Modify your machinery details, adjust daily pricing, or update availability.
                  </p>
                </div>

                <EquipmentForm
                  initialValues={{
                    name: equipment.name,
                    brand: equipment.brand,
                    model: equipment.model,
                    manufactureYear: equipment.manufactureYear,
                    categoryId: equipment.category.id,
                    description: equipment.description,
                    dailyRentalPrice: Number(equipment.dailyRentalPrice),
                    location: equipment.location,
                    availabilityStatus: equipment.availabilityStatus,
                    imageUrls: equipment.images.map((img) => img.imageUrl),
                  }}
                  onSubmit={handleFormSubmit}
                  isSubmitting={updateMutation.isPending}
                  submitButtonText="Save Changes"
                />
              </div>
            </main>
          </div>
          <Footer />
        </div>
      )}
    </ProtectedRoute>
  );
}
