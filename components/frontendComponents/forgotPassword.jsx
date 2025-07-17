"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation"; // ✅ correct import

const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export default function ForgotPasswordForm() {
  const router = useRouter(); // ✅ correct hook

  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  async function sendOtp() {
    if (!email) return toast.error("Please enter your email.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return toast.error("Please enter a valid email.");

    try {
      setSendingOtp(true);
      console.log("📤 Sending OTP to:", email);
      const res = await fetch("/api/forgotPassword/step0", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("OTP sent to your email!");
        console.log("✅ OTP sent successfully");
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("❌ Error sending OTP:", error);
      toast.error("Server error. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  }

  async function verifyOtp() {
    if (!email) return toast.error("Please enter your email.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return toast.error("Please enter a valid email.");
    if (!otp) return toast.error("Please enter the OTP.");
    if (otp.length !== 6) return toast.error("OTP must be exactly 6 digits.");
    if (!/^\d{6}$/.test(otp)) return toast.error("OTP must be numbers only.");

    try {
      console.log("🔍 Verifying OTP:", otp);
      const res = await fetch("/api/forgotPassword/step1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("OTP verified successfully!");
        console.log("✅ OTP verified");
        setOtpVerified(true);
      } else {
        toast.error(data.message || "Invalid OTP or email.");
      }
    } catch (error) {
      console.error("❌ Error verifying OTP:", error);
      toast.error("Server error. Please try again.");
    }
  }

  async function onSubmit(data) {
    try {
      console.log("🔒 Submitting new password:", data.password);
      const res = await fetch("/api/forgotPassword/step2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: data.password })
      });
      const response = await res.json();

      if (response.success) {
        toast.success("Password changed successfully!");
        console.log("✅ Password updated; redirecting to /login");
        router.push("/login");
      } else {
        toast.error(response.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("❌ Error changing password:", error);
      toast.error("Something went wrong.");
    }
  }

  return (
    <div
      className={`
        ${darkMode ? "bg-gray-950 text-black" : "bg-gray-100 text-gray-900"}
        min-h-screen flex items-center justify-center transition-colors
      `}
    >
      <div
        className="
          w-full max-w-md bg-white dark:bg-gray-900
          shadow-xl rounded-2xl p-8 space-y-6 mx-4 transition-colors
        "
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-semibold">Change Password</h2>
          <Button size="sm" variant="outline" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </Button>
        </div>

        {/* ✅ Email + OTP block */}
        {!otpVerified && (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-gray-900 dark:text-white">Enter Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  rounded-lg border border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400
                  text-gray-900 dark:text-white
                "
              />
              <Button
                onClick={sendOtp}
                size="sm"
                variant="secondary"
                className="mt-2"
                disabled={sendingOtp}
              >
                {sendingOtp ? "Sending..." : "Send OTP"}
              </Button>
            </div>

            <div>
              <label className="block mb-2 text-gray-900 dark:text-white">Enter OTP</label>
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button onClick={verifyOtp} className="w-full rounded-lg">
              Verify Email & OTP
            </Button>
          </div>
        )}

        {/* ✅ Password change form */}
        {otpVerified && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="
                            pr-10 rounded-lg border border-gray-300 dark:border-gray-600
                            bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400
                            text-gray-900 dark:text-white
                          "
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-gray-400"
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-white">Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        className="
                          rounded-lg border border-gray-300 dark:border-gray-600
                          bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400
                          text-gray-900 dark:text-white
                        "
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full rounded-lg">Change Password</Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
