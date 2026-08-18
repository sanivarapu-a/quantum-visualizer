"use client";

import { useState } from "react";
import { useAuth } from "../../lib/AuthContext";

export default function AuthDropdown() {
  const { isLoggedIn, email, login, register, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await login(emailInput, password);
      } else {
        await register(emailInput, password);
      }
      setIsOpen(false);
      setEmailInput("");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoggedIn) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          className="text-xs text-gray-300 hover:text-gray-100"
        >
          {email}
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full z-10 mt-2 w-40 rounded-md border border-white/10 bg-[#0a0e17] p-2 shadow-lg">
            <button
              type="button"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full rounded px-2 py-1.5 text-left text-xs text-gray-300 hover:bg-white/10"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300 hover:bg-white/10"
      >
        Log in
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-2 w-64 rounded-md border border-white/10 bg-[#0a0e17] p-4 shadow-lg">
          <div className="mb-3 flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={mode === "login" ? "font-semibold text-cyan-400" : "text-gray-400"}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={mode === "register" ? "font-semibold text-cyan-400" : "text-gray-400"}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              className="rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-gray-100 outline-none focus:border-cyan-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-gray-100 outline-none focus:border-cyan-400"
            />

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 rounded-full bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-[#0a0e17] hover:bg-cyan-300 disabled:opacity-50"
            >
              {isSubmitting ? "..." : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}