import { BusinessCard } from "@/components/business-card";
import { BusinessMap } from "@/components/business-map";
import { SearchBar } from "@/components/search-bar";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { BusinessWithProducts } from "@/lib/types";

type HomeProps = {
  searchParams: {
    q?: string;
    state?: string;
  };
};

async function getBusinesses(searchParams: HomeProps["searchParams"]) {
  const supabase = createSupabaseServerClient();
  const query = searchParams.q?.trim();
  const state = searchParams.state?.trim();
  let matchingProductBusinessIds: string[] = [];

  if (query) {
    const { data: productMatches } = await supabase
      .from("products")
      .select("business_id")
      .or(`name.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(50);

    matchingProductBusinessIds = Array.from(new Set((productMatches ?? []).map((product) => product.business_id)));
  }

  let request = supabase
    .from("businesses")
    .select("*, products(*)")
    .eq("status", "approved")
    .order("verified", { ascending: false })
    .order("created_at", { ascending: false });

  if (state) request = request.ilike("state", `%${state}%`);
  if (query) {
    const businessSearch = `name.ilike.%${query}%,category.ilike.%${query}%,market.ilike.%${query}%,street.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%`;
    const productSearch = matchingProductBusinessIds.length > 0 ? `,id.in.(${matchingProductBusinessIds.join(",")})` : "";
    request = request.or(`${businessSearch}${productSearch}`);
  }

  const { data, error } = await request.limit(24);
  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as BusinessWithProducts[];
}

export default async function Home({ searchParams }: HomeProps) {
  const businesses = await getBusinesses(searchParams);

  return (
    <main>
      <section className="border-b border-stone-200 bg-[#fdfbf5]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-clay">Verified physical commerce</p>
            <h1 className="max-w-3xl text-4xl font-black tracking-normal text-ink sm:text-5xl">
              Find real stores and real products around you.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-stone-700">
              Reemsun Commerce Map helps buyers discover nearby Nigerian businesses, compare catalog options, and contact vendors through WhatsApp, calls, or directions.
            </p>
            <SearchBar />
          </div>
          <BusinessMap businesses={businesses} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink">Nearby verified stores</h2>
            <p className="text-sm text-stone-600">{businesses.length} matching businesses</p>
          </div>
        </div>
        {businesses.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <div className="rounded border border-stone-200 bg-white p-8 text-center text-stone-600">
            No approved businesses match this search yet.
          </div>
        )}
      </section>
    </main>
  );
}
