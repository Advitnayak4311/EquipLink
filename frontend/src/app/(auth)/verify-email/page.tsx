"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, ArrowLeft, Mail } from "lucide-react";
import apiClient from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Verification token is missing. Please check your verification link.");
      return;
    }

    const verify = async () => {
      try {
        await apiClient.post(`/auth/verify-email?token=${token}`);
        setStatus("success");
        toast.success("Email verified successfully!");
      } catch (err: any) {
        setStatus("error");
        const msg = err.response?.data?.message || "Failed to verify email address. The link may have expired.";
        setErrorMessage(msg);
        toast.error(msg);
      }
    };

    verify();
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    setResending(true);
    try {
      await apiClient.post(`/auth/resend-verification?email=${resendEmail}`);
      toast.success("Verification email resent successfully! Please check your inbox.");
      setResendEmail("");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to resend verification email.";
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md border shadow-lg bg-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-extrabold tracking-tight">Email Verification</CardTitle>
        <CardDescription>EquipLink Heavy Machinery Marketplace</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground font-medium animate-pulse">
              Verifying your email address with the fleet network...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h3 className="text-xl font-bold text-foreground">Verification Successful!</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your email has been successfully verified. You can now login and explore your dashboard.
            </p>
            <Button asChild className="w-full mt-4 font-semibold">
              <Link href="/login">Go to Login</Link>
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6 py-2">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <XCircle className="h-16 w-16 text-destructive" />
              <h3 className="text-xl font-bold text-foreground">Verification Failed</h3>
              <p className="text-sm text-destructive font-medium bg-destructive/10 px-4 py-2.5 rounded-xl border border-destructive/20 w-full">
                {errorMessage}
              </p>
            </div>

            <div className="border-t pt-5">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Resend Verification Link</h4>
              <p className="text-xs text-muted-foreground mb-4">
                Enter your registered email address below, and we will send you a new link to verify your account.
              </p>
              <form onSubmit={handleResend} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground/60" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="pl-10"
                    disabled={resending}
                    required
                  />
                </div>
                <Button type="submit" className="w-full font-semibold" disabled={resending}>
                  {resending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Link...
                    </>
                  ) : (
                    "Send Verification Link"
                  )}
                </Button>
              </form>
            </div>

            <div className="text-center pt-2">
              <Link href="/login" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground font-semibold">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Login
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 py-12">
      <Suspense fallback={
        <Card className="w-full max-w-md border shadow-lg bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading verification details...</p>
          </CardContent>
        </Card>
      }>
        <VerifyEmailInner />
      </Suspense>
    </div>
  );
}
