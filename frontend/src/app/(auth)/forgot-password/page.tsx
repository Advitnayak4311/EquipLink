"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, Send } from "lucide-react";
import apiClient from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await apiClient.post(`/auth/forgot-password?email=${email}`);
      setSubmitted(true);
      toast.success("Password reset instructions sent!");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to generate password reset request.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 py-12">
      <Card className="w-full max-w-md border shadow-lg bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-extrabold tracking-tight">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full">
                <Send className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground font-sans">Check Your Inbox</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We've sent a password reset link to <strong>{email}</strong>. If the email doesn't arrive in a few minutes, check your spam folder.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline" className="w-full mt-4 font-semibold">
                Resend Reset Link
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground/60" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full font-semibold" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Requesting Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          )}

          <div className="text-center pt-2 border-t">
            <Link href="/login" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground font-semibold">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
