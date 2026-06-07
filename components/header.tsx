import Link from "next/link";
import { MapPin, ShieldCheck, Store } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded bg-palm text-white">
            <MapPin className="h-5 w-5" />
          </span>
          Reemsun Commerce Map
        </Link>
        <nav className="flex items-center gap-2 text-sm font-medium text-stone-700">
          <Link className="hidden rounded px-3 py-2 hover:bg-stone-100 sm:inline-flex" href="/vendor/dashboard">
            <Store className="mr-2 h-4 w-4" />
            Vendor
          </Link>
          <Link className="hidden rounded px-3 py-2 hover:bg-stone-100 sm:inline-flex" href="/admin">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Admin
          </Link>
          <Link className="rounded bg-ink px-4 py-2 text-white hover:bg-stone-800" href="/vendor">
            List business
          </Link>
        </nav>
      </div>
    </header>
  );
}
