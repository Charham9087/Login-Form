"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

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

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function LoginForm() {
  const [darkMode, setDarkMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,  // important: redirect false rakho
    });

    if (res.ok) {
      toast.success("Login successful!");
      router.push("/");  // home page pe le jao
    } else {
      toast.error("Invalid email or password");
    }
  };

  // ✅ loading or already logged in state
  if (status === "loading") {
    return <p className="text-center mt-10">Loading...</p>;
  }
  if (session) {
    return (
      <div className="text-center mt-10">
        <p>Welcome, {session.user?.email}!</p>
        <Button onClick={() => router.push("/")}>Go to home</Button>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? "bg-gray-950 text-black" : "bg-gray-100 text-gray-900"} min-h-screen flex items-center justify-center`}>
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 space-y-6 mx-4">
        
        <div className="flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-semibold">Sign In</h2>
          <Button size="sm" variant="outline" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="email" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="you@example.com" type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="password" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input {...field} placeholder="••••••••" type={showPassword ? "text" : "password"} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-2 text-gray-500">
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="text-right">
              <button type="button" onClick={() => router.push("/forgotPassword")} className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full rounded-lg">Sign In</Button>

            <Button type="button" variant="outline" className="w-full rounded-lg" onClick={() => signIn("google")}>
              Sign in with Google
            </Button>

            <p className="text-center text-sm">
              Don’t have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
