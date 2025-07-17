"use client";

import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function VerifyOTPPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Handle OTP verification
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📦 Entered OTP:", otp);
    try {
      setLoading(true);
      const response = await fetch("/api/signup/step2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otp }),
      });
      const res = await response.json();

      if (response.ok) {
        toast.success(res.message || "✅ OTP verified successfully!");
        router.push("/login");
      } else {
        toast.error(res.error || "❌ Invalid OTP");
      }
    } catch (error) {
      console.error("❌ Error verifying OTP:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle resend OTP
  const resendOtp = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/signup/step1", { method: "POST" });
      const res = await response.json();
      if (response.ok) {
        toast.success(res.message || "✅ OTP resent successfully!");
      } else {
        toast.error(res.error || "❌ Failed to resend OTP");
      }
    } catch (error) {
      console.error("❌ Error resending OTP:", error);
      toast.error("Something went wrong while resending!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`
        ${darkMode ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"}
        min-h-screen flex items-center justify-center transition-colors
      `}
    >
      <div
        className="
          w-full max-w-md md:max-w-lg
          bg-white dark:bg-gray-900
          shadow-xl rounded-2xl p-8 space-y-6 mx-4 transition-colors
        "
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-semibold">Verify OTP</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </Button>
        </div>

        {/* OTP Input */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
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

          {/* Submit button */}
          <Button type="submit" disabled={loading} className="w-full rounded-lg">
            {loading ? "Verifying..." : "Verify"}
          </Button>

          {/* Resend link */}
          <p className="text-center text-sm">
            Didn’t get code?{" "}
            <button
              type="button"
              onClick={resendOtp}
              disabled={loading}
              className="text-blue-600 dark:text-cyan-400 hover:underline"
            >
              {loading ? "Resending..." : "Resend"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
