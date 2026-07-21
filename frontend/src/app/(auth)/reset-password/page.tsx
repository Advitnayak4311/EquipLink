"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import apiClient from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Password reset token is missing.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await apiClient.post(`/auth/reset-password?token=${token}&newPassword=${password}`);
      setSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to reset password. Link may have expired.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border shadow-lg bg-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-extrabold tracking-tight">Reset Password</CardTitle>
        <CardDescription>
          Enter and confirm your new account password
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {success ? (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
            <h3 className="text-xl font-bold text-foreground">Password Reset Done</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your password has been successfully reset. You can now login with your new credentials.
            </p>
            <Button asChild className="w-full mt-4 font-semibold">
              <Link href="/login">Go to Login</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="pass" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground/60" />
                <Input
                  id="pass"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPass" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground/60" />
                <Input
                  id="confirmPass"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Password...
                </>
              ) : (
                "Save New Password"
              )}
            </Button>
          </form>
        )}

        {!success && (
          <div className="text-center pt-2 border-t">
            <Link href="/login" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground font-semibold">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Login
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 py-12">
      <Suspense fallback={
        <Card className="w-full max-w-md border shadow-lg bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading reset window...</p>
          </CardContent>
        </Card>
      }>
        <ResetPasswordInner />
      </Suspense>
    </div>
  );
}
