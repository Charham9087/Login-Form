"use client";

import { useState } from "react";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// Validation schema
const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function SignupPage() {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [isLoading, setIsLoading] = useState(false); // <-- loading state

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    console.log("Form data:", data);
    try {
      setIsLoading(true); // show loader
      await fetch('/api/signup/step1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      router.push("/verifyOtp");
    } catch (error) {
      console.error("❌ Error submitting form:", error);
    } finally {
      setIsLoading(false); // hide loader
    }
  };

  return (
    <div className={`
      ${darkMode ? "bg-gray-950 text-black" : "bg-gray-100 text-gray-900"}
      min-h-screen flex items-center justify-center transition-colors
    `}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            <span className="text-white">Processing your data...<br/> Plz Wait</span>
          </div>
        </div>
      )}

      <div className="
        w-full max-w-md md:max-w-lg 
        bg-white dark:bg-gray-900 
        shadow-xl rounded-2xl p-8 space-y-6 mx-4 transition-colors
      ">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-semibold">Sign Up</h2>
          <Button size="sm" variant="outline" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 dark:text-white">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      type="email"
                      {...field}
                      className="
                        rounded-lg border border-gray-300 dark:border-gray-600
                        bg-white dark:bg-gray-800
                        placeholder-gray-500 dark:placeholder-gray-400
                        text-gray-900 dark:text-white
                      "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 dark:text-white">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        {...field}
                        value={passwordValue}
                        onChange={(e) => {
                          field.onChange(e);
                          setPasswordValue(e.target.value);
                        }}
                        className="
                          pr-10 rounded-lg border border-gray-300 dark:border-gray-600
                          bg-white dark:bg-gray-800
                          placeholder-gray-500 dark:placeholder-gray-400
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

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 dark:text-white">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      {...field}
                      value={confirmPasswordValue}
                      onChange={(e) => {
                        field.onChange(e);
                        setConfirmPasswordValue(e.target.value);
                      }}
                      className="
                        rounded-lg border border-gray-300 dark:border-gray-600
                        bg-white dark:bg-gray-800
                        placeholder-gray-500 dark:placeholder-gray-400
                        text-gray-900 dark:text-white
                      "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button type="submit" className="w-full rounded-lg">Sign Up</Button>

            {/* Login link */}
            <p className="text-center text-sm">
              Already have an account?{" "}
              <button onClick={() => router.push("/login")}
                className="text-blue-600 dark:text-cyan-400 hover:underline">
                Signin
              </button>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
