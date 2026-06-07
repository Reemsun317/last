import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, MapPinned, Phone, Route, Store, MessageCircle } from "lucide-react";
import type { BusinessWithProducts } from "@/lib/types";
import { directionsUrl, whatsappUrl } from "@/lib/utils";
import { ProductCard } from "./product-card";
import { TrackLink } from "./track-link";

type BusinessCardProps = {
  business: BusinessWithProducts;
};

export function BusinessCard({ business }: BusinessCardProps) {
  const location = [business.street, business.market, business.city, business.state].filter(Boolean).join(", ");

  return (
    <article className="overflow-hidden rounded border border-stone-200 bg-white shadow-soft">
      <div className="relative h-44 bg-stone-100">
        {business.cover_image_url ? (
          <Image src={business.cover_image_url} alt={business.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-stone-400">
            <Store className="h-12 w-12" />
          </div>
        )}
      </div>
      <div className="space-y-4 p-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-ink">{business.name}</h2>
            {business.verified ? <BadgeCheck className="h-5 w-5 text-palm" /> : null}
          </div>
          <p className="mt-1 text-sm text-stone-600">{business.description}</p>
          <p className="mt-2 flex items-center gap-2 text-sm text-stone-700">
            <MapPinned className="h-4 w-4 text-clay" />
            {location}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <TrackLink businessId={business.id} metric="whatsapp_clicks" className="flex items-center justify-center gap-2 rounded bg-palm px-3 py-2 font-semibold text-white" href={whatsappUrl(business.whatsapp, business.name)} target="_blank">
            <MessageCircle className="h-4 w-4" />
            Chat
          </TrackLink>
          <TrackLink businessId={business.id} metric="call_clicks" className="flex items-center justify-center gap-2 rounded border border-stone-200 px-3 py-2 font-semibold" href={`tel:${business.phone}`}>
            <Phone className="h-4 w-4" />
            Call
          </TrackLink>
          <TrackLink businessId={business.id} metric="direction_clicks" className="flex items-center justify-center gap-2 rounded border border-stone-200 px-3 py-2 font-semibold" href={directionsUrl(business.latitude, business.longitude)} target="_blank">
            <Route className="h-4 w-4" />
            Route
          </TrackLink>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500">Catalog</h3>
            <Link href={`/business/${business.slug}`} className="text-sm font-semibold text-palm">
              View profile
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {business.products.slice(0, 2).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
