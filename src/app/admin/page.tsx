import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function AdminPage() {
  const supabase = createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return (
      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-ink">Admin access</h1>
        <p className="mt-2 text-stone-700">Sign in with an account that has the admin role.</p>
        <Link href="/login" className="mt-5 inline-flex rounded bg-ink px-5 py-3 font-semibold text-white">Sign in</Link>
      </main>
    );
  }

  const { data: role } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", auth.user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!role) {
    return (
      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-ink">Admin role required</h1>
        <p className="mt-2 text-stone-700">Ask the project owner to add your user ID to public.user_roles with the admin role.</p>
      </main>
    );
  }

  const { data: businesses } = await supabase.from("businesses").select("*").order("created_at", { ascending: false }).limit(50);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-3xl font-black text-ink">
          <ShieldCheck className="h-7 w-7 text-palm" />
          Admin listings
        </h1>
        <p className="mt-2 text-stone-700">Approve, reject, and verify submitted businesses.</p>
      </div>
      <div className="overflow-hidden rounded border border-stone-200 bg-white shadow-soft">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="bg-stone-100 text-xs uppercase tracking-wide text-stone-600">
            <tr>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {(businesses ?? []).map((business) => (
              <tr key={business.id}>
                <td className="px-4 py-3">
                  <p className="font-semibold text-ink">{business.name}</p>
                  <p className="text-stone-600">{business.category}</p>
                </td>
                <td className="px-4 py-3 text-stone-700">{business.city}, {business.state}</td>
                <td className="px-4 py-3 capitalize">{business.status}</td>
                <td className="px-4 py-3">{business.verified ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <form action={`/api/admin/businesses/${business.id}`} method="post">
                      <input type="hidden" name="status" value="approved" />
                      <button className="rounded bg-palm px-3 py-2 font-semibold text-white" title="Approve">
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    </form>
                    <form action={`/api/admin/businesses/${business.id}`} method="post">
                      <input type="hidden" name="status" value="rejected" />
                      <button className="rounded bg-clay px-3 py-2 font-semibold text-white" title="Reject">
                        <XCircle className="h-4 w-4" />
                      </button>
                    </form>
                    <form action={`/api/admin/businesses/${business.id}`} method="post">
                      <input type="hidden" name="verified" value="true" />
                      <button className="rounded border border-stone-200 px-3 py-2 font-semibold" title="Verify">
                        <ShieldCheck className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
