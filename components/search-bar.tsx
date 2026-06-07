"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [state, setState] = useState(params.get("state") ?? "");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = new URLSearchParams();
    if (query.trim()) next.set("q", query.trim());
    if (state.trim()) next.set("state", state.trim());
    router.push(`/?${next.toString()}`);
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded border border-stone-200 bg-white p-3 shadow-soft md:grid-cols-[1fr_220px_auto]">
      <label className="flex items-center gap-2 rounded border border-stone-200 px-3 py-2">
        <Search className="h-5 w-5 text-stone-500" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full bg-transparent text-sm outline-none"
          placeholder="Search products, stores, markets, streets, or cities"
        />
      </label>
      <label className="flex items-center gap-2 rounded border border-stone-200 px-3 py-2">
        <SlidersHorizontal className="h-5 w-5 text-stone-500" />
        <input
          value={state}
          onChange={(event) => setState(event.target.value)}
          className="w-full bg-transparent text-sm outline-none"
          placeholder="State"
        />
      </label>
      <button className="rounded bg-palm px-5 py-2 text-sm font-semibold text-white hover:bg-[#105a37]" type="submit">
        Search
      </button>
    </form>
  );
}
