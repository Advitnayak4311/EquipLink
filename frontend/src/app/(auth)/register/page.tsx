"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, User, HardHat } from "lucide-react";
import type { ApiError } from "@/types";
import type { AxiosError } from "axios";

// ---- Zod schema ----

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    role: z.enum(["CUSTOMER", "OWNER"]),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// ---- Component ----

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "CUSTOMER",
      acceptTerms: false,
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const response = await authApi.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: data.role,
        acceptTerms: data.acceptTerms,
      });
      login(response.user);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message ||
        (axiosError.code === "ERR_NETWORK" || !axiosError.response
          ? "Unable to connect to the EquipLink backend server. Please check your connection."
          : "Registration failed. Please try again.");
      toast.error(message);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-xl border shadow-sm">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Join EquipLink Heavy Equipment Marketplace
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate suppressHydrationWarning>
        {/* Role Selection Tabs */}
        <div className="space-y-2">
          <Label>Select Account Type</Label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setValue("role", "CUSTOMER")}
              className={`flex items-center justify-center p-3 rounded-lg border text-sm font-medium transition-all ${
                selectedRole === "CUSTOMER"
                  ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                  : "border-input bg-background hover:bg-muted text-muted-foreground"
              }`}
            >
              <User className="mr-2 h-4 w-4" />
              Customer
            </button>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setValue("role", "OWNER")}
              className={`flex items-center justify-center p-3 rounded-lg border text-sm font-medium transition-all ${
                selectedRole === "OWNER"
                  ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                  : "border-input bg-background hover:bg-muted text-muted-foreground"
              }`}
            >
              <HardHat className="mr-2 h-4 w-4" />
              Equipment Owner
            </button>
          </div>
        </div>

        {/* First & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              aria-invalid={!!errors.firstName}
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              aria-invalid={!!errors.lastName}
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-xs text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="9876543210"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Accept Terms */}
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="acceptTerms"
            className="h-4 w-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
            {...register("acceptTerms")}
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="acceptTerms" className="text-sm font-medium cursor-pointer">
              Accept terms and conditions
            </Label>
            <p className="text-xs text-muted-foreground">
              By checking this box, you agree to our Terms of Service and Privacy Policy.
            </p>
            {errors.acceptTerms && (
              <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Register"
          )}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
