import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-server";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function POST(request: Request) {
  const form = await request.formData();
  const name = String(form.get("name") ?? "");
  const supabase = createSupabaseServerClient();
  const { data: userResult } = await supabase.auth.getUser();

  const payload = {
    owner_id: userResult.user?.id ?? null,
    name,
    slug: `${slugify(name)}-${crypto.randomUUID().slice(0, 8)}`,
    description: String(form.get("description") ?? ""),
    category: String(form.get("category") ?? ""),
    market: String(form.get("market") ?? ""),
    street: String(form.get("street") ?? ""),
    city: String(form.get("city") ?? ""),
    state: String(form.get("state") ?? ""),
    phone: String(form.get("phone") ?? ""),
    whatsapp: String(form.get("whatsapp") ?? ""),
    latitude: Number(form.get("latitude")),
    longitude: Number(form.get("longitude")),
    cover_image_url: String(form.get("cover_image_url") ?? "") || null,
    status: "pending",
    verified: false
  };

  const { error } = await supabase.from("businesses").insert(payload);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/");
  revalidatePath("/vendor/dashboard");
  return NextResponse.redirect(new URL("/vendor/dashboard", request.url));
}
