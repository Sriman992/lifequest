"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("That email and password don't match an account.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6">
      <div className="ambient-orb left-[-2rem] top-16 h-48 w-48 opacity-60" aria-hidden="true" />
      <div className="ambient-orb bottom-6 right-[-3rem] h-52 w-52 opacity-40" aria-hidden="true" />

      <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="room-shell hidden min-h-[560px] p-4 lg:block"
        >
          <div className="room-window" aria-hidden="true">
            <div className="moon-dot">🌙</div>
          </div>
          <div className="room-lamp" aria-hidden="true" style={{ left: "2.4rem" }} />
          <div className="room-table" style={{ bottom: "1.8rem", width: "62%" }} aria-hidden="true" />
          <div className="room-shelf" style={{ width: "52%", top: "8.2rem" }} aria-hidden="true" />
          <div className="room-plant" style={{ left: "4.2rem", bottom: "2.7rem" }} aria-hidden="true">🪴</div>
          <div className="room-book" style={{ left: "38%" }}>📚</div>
          <div className="room-book" style={{ left: "49%" }}>📖</div>
          <div className="room-cat" style={{ right: "4rem" }} aria-hidden="true">🐈</div>
          <div className="absolute bottom-6 left-8 text-4xl" aria-hidden="true">🪑</div>
        </motion.section>

        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          onSubmit={handleSubmit}
          className="cozy-panel mx-auto w-full max-w-md p-6 sm:p-8"
          aria-labelledby="login-heading"
        >
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#d2c6ae]">Welcome back</p>
              <h1 id="login-heading" className="mt-2 font-display text-3xl text-[#f7ebdd]">
                Return to your room
              </h1>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8a24b]/12 text-xl" aria-hidden="true">
              🪴
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#d7cdb5]">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="cozy-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#d7cdb5]">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="cozy-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-xs font-semibold uppercase tracking-[0.12em] text-[#d9cdb8]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-4 rounded-2xl border border-[#c97c82]/30 bg-[#c97c82]/10 px-3 py-2 text-sm text-[#f7d0d5]">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="cozy-button mt-6 w-full">
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="mt-5 text-center text-sm text-[#d7cdb5]">
            New here?{" "}
            <Link href="/register" className="font-semibold text-[#f2c983] underline decoration-[#f2c983]/50 underline-offset-4">
              Create a room
            </Link>
          </p>
        </motion.form>
      </div>
    </main>
  );
}
