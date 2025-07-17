"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

export default function HomePage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const { data: session } = useSession();  // ✅ check user

  return (
    <div className={`
      ${darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-100 text-gray-900"}
      min-h-screen flex flex-col justify-between items-center relative transition-colors duration-300
    `}>
      {/* ✅ Sign Out button: sirf jab logged in hai */}
      {session && (
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="absolute top-4 right-4
            px-4 py-2 rounded-xl shadow-md font-semibold text-base
            bg-gray-800 hover:bg-black text-white transition-colors"
        >
          Sign Out
        </Button>
      )}

      {/* Top section */}
      <div className="flex flex-col items-center gap-4 mt-16">
        <h1 className={`
          text-4xl md:text-5xl font-extrabold text-center drop-shadow-lg animate-fadeSlide
          ${darkMode
            ? "bg-gradient-to-r from-white via-gray-300 to-gray-100"
            : "bg-gradient-to-r from-black via-gray-800 to-gray-700"}
          text-transparent bg-clip-text
        `}>
          Hello...!! Welcome to My Login Page
        </h1>

        {/* ✅ Show user email/name */}
        {session && (
          <p className="mt-2 text-sm text-center text-gray-400">
            Welcome, {session.user?.name || session.user?.email}!
          </p>
        )}

        <p className="
          text-sm md:text-base text-gray-600 dark:text-gray-400 text-center
          max-w-xl mt-2">
          Secure, modern, and beautifully designed login system.
        </p>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setDarkMode(!darkMode)}
          className="border-gray-400 dark:border-gray-600"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </Button>
      </div>

      {/* Login links section */}
      <div className="
        mt-8 bg-white shadow-lg rounded-xl p-6 w-full max-w-md flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Login Links
        </h2>

        <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
          <Button
            onClick={() => router.push("/login")}
            className="
              px-6 py-3 rounded-xl shadow-md font-semibold text-base transition-colors w-full md:w-auto
              bg-gray-800 hover:bg-black text-white"
          >
            Login
          </Button>
          <Button
            onClick={() => router.push("/signup")}
            className="
              px-6 py-3 rounded-xl shadow-md font-semibold text-base transition-colors w-full md:w-auto
              bg-gray-800 hover:bg-black text-white"
          >
            Sign Up
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className={`
        mb-4 text-xs md:text-sm text-center font-medium
        ${darkMode
          ? "bg-gradient-to-r from-white via-gray-300 to-gray-100"
          : "bg-gradient-to-r from-black via-gray-800 to-gray-700"}
        text-transparent bg-clip-text
      `}>
        © 2025 My Login App. All rights reserved. | Made by <span className="font-bold">Ch Arham</span>
      </footer>
    </div>
  );
}
