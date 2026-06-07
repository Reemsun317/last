import { UploadField } from "@/components/upload-field";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { Store } from "lucide-react";
import Link from "next/link";

export default async function VendorRegisterPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return (
      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-ink">Sign in to list your business</h1>
        <p className="mt-2 text-stone-700">Vendor submissions are tied to a verified account so admins can review and approve each listing.</p>
        <Link href="/login" className="mt-5 inline-flex rounded bg-ink px-5 py-3 font-semibold text-white">Sign in</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-3xl font-black text-ink">
          <Store className="h-7 w-7 text-palm" />
          Register your business
        </h1>
        <p className="mt-2 text-stone-700">Submit store details for admin approval and verification.</p>
      </div>
      <form action="/api/businesses" method="post" className="grid gap-4 rounded border border-stone-200 bg-white p-5 shadow-soft md:grid-cols-2">
        <input required name="name" placeholder="Business name" className="rounded border border-stone-200 px-3 py-2" />
        <input required name="category" placeholder="Category" className="rounded border border-stone-200 px-3 py-2" />
        <input name="market" placeholder="Market" className="rounded border border-stone-200 px-3 py-2" />
        <input name="street" placeholder="Street" className="rounded border border-stone-200 px-3 py-2" />
        <input required name="city" placeholder="City" className="rounded border border-stone-200 px-3 py-2" />
        <input required name="state" placeholder="State" className="rounded border border-stone-200 px-3 py-2" />
        <input required name="phone" placeholder="Phone" className="rounded border border-stone-200 px-3 py-2" />
        <input required name="whatsapp" placeholder="WhatsApp number with country code" className="rounded border border-stone-200 px-3 py-2" />
        <input required name="latitude" type="number" step="any" placeholder="Latitude" className="rounded border border-stone-200 px-3 py-2" />
        <input required name="longitude" type="number" step="any" placeholder="Longitude" className="rounded border border-stone-200 px-3 py-2" />
        <textarea name="description" placeholder="Business description" className="min-h-28 rounded border border-stone-200 px-3 py-2 md:col-span-2" />
        <div className="md:col-span-2">
          <UploadField bucket="business-images" name="cover_image_url" label="Business image" />
        </div>
        <button className="rounded bg-ink px-5 py-3 font-semibold text-white md:col-span-2" type="submit">
          Submit for approval
        </button>
      </form>
    </main>
  );
}
