import { notFound } from "next/navigation";
import { BadgeCheck, MapPinned, MessageCircle, Phone, Route } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { TrackLink } from "@/components/track-link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { BusinessWithProducts } from "@/lib/types";
import { directionsUrl, whatsappUrl } from "@/lib/utils";

type BusinessPageProps = {
  params: {
    slug: string;
  };
};

export default async function BusinessPage({ params }: BusinessPageProps) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("businesses")
    .select("*, products(*)")
    .eq("slug", params.slug)
    .eq("status", "approved")
    .single();

  if (!data) notFound();

  const business = data as BusinessWithProducts;
  const location = [business.street, business.market, business.city, business.state].filter(Boolean).join(", ");

  await supabase.rpc("increment_business_metric", {
    business_id_input: business.id,
    metric_name: "views"
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="rounded border border-stone-200 bg-white p-6 shadow-soft">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-black text-ink">{business.name}</h1>
            {business.verified ? <BadgeCheck className="h-6 w-6 text-palm" /> : null}
          </div>
          <p className="mt-3 max-w-3xl leading-7 text-stone-700">{business.description}</p>
          <p className="mt-4 flex items-center gap-2 text-stone-700">
            <MapPinned className="h-5 w-5 text-clay" />
            {location}
          </p>
        </div>
        <aside className="space-y-3 rounded border border-stone-200 bg-white p-4 shadow-soft">
          <TrackLink businessId={business.id} metric="whatsapp_clicks" className="flex items-center justify-center gap-2 rounded bg-palm px-4 py-3 font-semibold text-white" href={whatsappUrl(business.whatsapp, business.name)} target="_blank">
            <MessageCircle className="h-5 w-5" />
            WhatsApp vendor
          </TrackLink>
          <TrackLink businessId={business.id} metric="call_clicks" className="flex items-center justify-center gap-2 rounded border border-stone-200 px-4 py-3 font-semibold" href={`tel:${business.phone}`}>
            <Phone className="h-5 w-5" />
            Call business
          </TrackLink>
          <TrackLink businessId={business.id} metric="direction_clicks" className="flex items-center justify-center gap-2 rounded border border-stone-200 px-4 py-3 font-semibold" href={directionsUrl(business.latitude, business.longitude)} target="_blank">
            <Route className="h-5 w-5" />
            Get directions
          </TrackLink>
        </aside>
      </section>
      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-bold text-ink">Product catalog</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {business.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
