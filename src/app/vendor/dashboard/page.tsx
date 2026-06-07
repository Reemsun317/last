import { BarChart3, PackagePlus } from "lucide-react";
import Link from "next/link";
import { UploadField } from "@/components/upload-field";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { formatNaira } from "@/lib/utils";

export default async function VendorDashboardPage() {
  const supabase = createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return (
      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-ink">Vendor dashboard</h1>
        <p className="mt-2 text-stone-700">Sign in to manage your business profile, catalog, and metrics.</p>
        <Link href="/login" className="mt-5 inline-flex rounded bg-ink px-5 py-3 font-semibold text-white">Sign in</Link>
      </main>
    );
  }

  const { data: businesses } = await supabase
    .from("businesses")
    .select("*, business_metrics(*)")
    .eq("owner_id", auth.user.id)
    .order("created_at", { ascending: false });
  const selectedBusiness = businesses?.[0];
  const { data: products } = selectedBusiness
    ? await supabase.from("products").select("*").eq("business_id", selectedBusiness.id).order("created_at", { ascending: false })
    : { data: [] };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-ink">Vendor dashboard</h1>
          <p className="text-stone-700">Manage products, images, and performance metrics.</p>
        </div>
        <a href="/vendor" className="rounded bg-palm px-4 py-2 font-semibold text-white">Add business</a>
      </div>

      {selectedBusiness ? (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-4">
            <div className="rounded border border-stone-200 bg-white p-5 shadow-soft">
              <h2 className="text-xl font-bold text-ink">{selectedBusiness.name}</h2>
              <p className="mt-1 text-sm capitalize text-stone-600">{selectedBusiness.status} listing</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {["views", "whatsapp_clicks", "call_clicks", "direction_clicks"].map((key) => (
                  <div key={key} className="rounded border border-stone-200 p-3">
                    <p className="text-xs uppercase tracking-wide text-stone-500">{key.replace("_", " ")}</p>
                    <p className="mt-1 text-2xl font-black text-ink">{selectedBusiness.business_metrics?.[0]?.[key] ?? 0}</p>
                  </div>
                ))}
              </div>
            </div>

            <form action="/api/products" method="post" className="space-y-3 rounded border border-stone-200 bg-white p-5 shadow-soft">
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                <PackagePlus className="h-5 w-5 text-palm" />
                Upload product
              </h2>
              <input type="hidden" name="business_id" value={selectedBusiness.id} />
              <input required name="name" placeholder="Product name" className="w-full rounded border border-stone-200 px-3 py-2" />
              <input required name="category" placeholder="Category" className="w-full rounded border border-stone-200 px-3 py-2" />
              <input required name="price" type="number" min="0" placeholder="Price in NGN" className="w-full rounded border border-stone-200 px-3 py-2" />
              <select name="stock_status" className="w-full rounded border border-stone-200 px-3 py-2">
                <option value="in_stock">In stock</option>
                <option value="low_stock">Low stock</option>
                <option value="out_of_stock">Out of stock</option>
              </select>
              <textarea name="description" placeholder="Description" className="min-h-24 w-full rounded border border-stone-200 px-3 py-2" />
              <UploadField bucket="product-images" name="image_url" label="Product image" />
              <button className="w-full rounded bg-ink px-4 py-3 font-semibold text-white" type="submit">Save product</button>
            </form>
          </section>

          <section className="rounded border border-stone-200 bg-white p-5 shadow-soft">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-ink">
              <BarChart3 className="h-5 w-5 text-clay" />
              Products
            </h2>
            <div className="space-y-4">
              {(products ?? []).map((product) => (
                <form key={product.id} action={`/api/products/${product.id}`} method="post" className="grid gap-2 rounded border border-stone-200 p-3 md:grid-cols-2">
                  <input name="name" defaultValue={product.name} className="rounded border border-stone-200 px-3 py-2" />
                  <input name="category" defaultValue={product.category} className="rounded border border-stone-200 px-3 py-2" />
                  <input name="price" type="number" defaultValue={product.price} className="rounded border border-stone-200 px-3 py-2" />
                  <select name="stock_status" defaultValue={product.stock_status} className="rounded border border-stone-200 px-3 py-2">
                    <option value="in_stock">In stock</option>
                    <option value="low_stock">Low stock</option>
                    <option value="out_of_stock">Out of stock</option>
                  </select>
                  <textarea name="description" defaultValue={product.description ?? ""} className="min-h-20 rounded border border-stone-200 px-3 py-2 md:col-span-2" />
                  <div className="flex items-center justify-between md:col-span-2">
                    <span className="text-sm font-semibold text-palm">{formatNaira(product.price)}</span>
                    <button className="rounded bg-ink px-4 py-2 text-sm font-semibold text-white" type="submit">Save edits</button>
                  </div>
                </form>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="rounded border border-stone-200 bg-white p-8 text-center text-stone-700">
          Register a business before uploading products.
        </div>
      )}
    </main>
  );
}
