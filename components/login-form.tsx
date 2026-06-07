"use client";

import { FormEvent, useState } from "react";
import { Mail } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Sending sign-in link...");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    setMessage(error ? error.message : "Check your email for the sign-in link.");
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded border border-stone-200 bg-white p-5 shadow-soft">
      <label className="block">
        <span className="text-sm font-semibold text-ink">Email address</span>
        <span className="mt-2 flex items-center gap-2 rounded border border-stone-200 px-3 py-2">
          <Mail className="h-5 w-5 text-stone-500" />
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full bg-transparent outline-none"
            placeholder="vendor@example.com"
          />
        </span>
      </label>
      <button className="w-full rounded bg-ink px-4 py-3 font-semibold text-white" type="submit">
        Send magic link
      </button>
      {message ? <p className="text-sm text-stone-700">{message}</p> : null}
    </form>
  );
}
