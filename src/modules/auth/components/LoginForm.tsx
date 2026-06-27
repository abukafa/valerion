"use client";

import { useState, useEffect } from "react";
import { loginUser } from "@/modules/auth/actions";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      const result = await loginUser(formData);
      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      }
    } catch (e) {
      // If it throws NEXT_REDIRECT, it will redirect normally.
    }
  };

  useEffect(() => {
    // Check if user just registered successfully
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("registered") === "true") {
        setError("Akun berhasil dibuat! Silakan masuk.");
        // We put this in error state just to show the message, or we can make a success state.
        // Actually let's just make it a success message by styling it differently below.
      }
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div
            className={`text-sm p-3 rounded-lg text-center font-medium ${
              error.includes("berhasil")
                ? "bg-green-500/10 border border-green-500/50 text-green-500"
                : "bg-red-500/10 border border-red-500/50 text-red-500"
            }`}
          >
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-white">Email</label>
          <input
            type="email"
            name="email"
            required
            className="bg-background border border-card-border p-3 rounded-xl text-white outline-none focus:border-primary/50 transition-colors"
            placeholder="nama@email.com"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-white">Password</label>
          <input
            type="password"
            name="password"
            required
            className="bg-background border border-card-border p-3 rounded-xl text-white outline-none focus:border-primary/50 transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(255,77,0,0.3)] hover:shadow-[0_0_25px_rgba(255,77,0,0.5)] disabled:opacity-50"
        >
          {isLoading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-card-border"></div>
        <span className="flex-shrink-0 mx-4 text-foreground/40 text-xs font-medium uppercase tracking-wider">
          Atau
        </span>
        <div className="flex-grow border-t border-card-border"></div>
      </div>

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 transition-colors border border-transparent shadow-md"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
            fill="#4285F4"
          />
          <path
            d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7253 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
            fill="#34A853"
          />
          <path
            d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03296C-0.371021 20.0012 -0.371021 28.0009 3.03296 34.7725L11.0051 28.6006Z"
            fill="#FBBC04"
          />
          <path
            d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4418 -0.068932 24.48 0.00161733C15.4056 0.00161733 7.10718 5.11644 3.03296 13.2296L11.0051 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
            fill="#EA4335"
          />
        </svg>
        Masuk dengan Google
      </button>
    </div>
  );
}
