import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Breadcrumb from "@/components/common/Breadcrumb";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumb />
        <div className="mt-4 p-8 bg-card rounded-xl border max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Contact Us</h1>
          <p className="text-muted-foreground leading-relaxed">
            Have questions about listing your fleet, custom logistics, or rental insurance policies? Reach out to our 24/7 support line or submit a query form here.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
