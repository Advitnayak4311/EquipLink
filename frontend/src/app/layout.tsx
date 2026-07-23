import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EquipLink – Heavy Equipment Marketplace & Telematics",
    template: "%s | EquipLink",
  },
  description:
    "India's premier digitized heavy machinery marketplace and fleet telematics ecosystem. Rent or lease excavators, cranes, loaders, and pavers from verified enterprise owners.",
  keywords: ["heavy equipment", "equipment rental", "construction machinery", "excavator rental", "telematics", "fleet management"],
  openGraph: {
    title: "EquipLink – Heavy Equipment Marketplace & Telematics",
    description: "Rent, lease, and track heavy construction machinery with telematics and verified fleet owners.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakartaSans.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster position="top-right" richColors />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
