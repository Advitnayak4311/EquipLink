"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { ShieldCheck, Mail, ArrowRight, RotateCcw, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api/auth";
import { LoginResponse } from "@/types";

interface VerifyOtpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onSuccess: (response: LoginResponse) => void;
}

export default function VerifyOtpModal({
  open,
  onOpenChange,
  email,
  onSuccess,
}: VerifyOtpModalProps) {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open && cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [open, cooldown]);

  useEffect(() => {
    if (open) {
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    }
  }, [open]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    if (value.length > 1) {
      // Paste handling
      const pasted = value.slice(0, 6).split("");
      pasted.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    } else {
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP code.");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.verifyOtp({ email, otp: fullOtp });
      toast.success("Email verified successfully! Welcome to EquipLink.");
      onSuccess(res);
      onOpenChange(false);
    } catch (err: any) {
      console.error("OTP verification error:", err);
      const msg = err?.response?.data?.message || err?.message || "Invalid OTP verification code. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;

    setResending(true);
    try {
      await authApi.sendOtp(email);
      toast.success("A fresh 6-digit OTP code has been sent to your email!");
      setCooldown(60);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to resend OTP. Please try again.";
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card text-card-foreground border shadow-2xl p-6 font-sans">
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl font-extrabold tracking-tight font-heading">
            Email OTP Verification
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            We sent a 6-digit verification OTP code to <strong className="text-foreground">{email}</strong>. Please enter the code below to complete registration.
          </DialogDescription>
        </DialogHeader>

        {/* 6-Digit OTP Box Grid */}
        <div className="py-4 space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-12 text-center text-xl font-extrabold rounded-lg border border-input bg-background focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all shadow-xs"
              />
            ))}
          </div>

          <p className="text-center text-xs text-amber-500 font-medium -mt-2">
            💡 Demo/Test Master OTP: <code className="font-mono font-bold bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-400">123456</code>
          </p>

          <Button
            type="button"
            onClick={handleVerify}
            disabled={loading || otp.join("").length < 6}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm h-11 shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying OTP...
              </>
            ) : (
              <>
                Verify Email & Proceed <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          {/* Resend Timer & Action */}
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> Didn't receive the code?
            </span>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={handleResend}
              disabled={cooldown > 0 || resending}
              className="text-xs font-bold text-amber-500 hover:text-amber-600 disabled:opacity-50"
            >
              {resending ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <RotateCcw className="h-3 w-3 mr-1" />
              )}
              {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
