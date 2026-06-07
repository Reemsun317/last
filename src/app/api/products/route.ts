import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const form = await request.formData();
  const supabase = createSupabaseServerClient();

  const payload = {
    business_id: String(form.get("business_id") ?? ""),
    name: String(form.get("name") ?? ""),
    description: String(form.get("description") ?? ""),
    category: String(form.get("category") ?? ""),
    price: Number(form.get("price")),
    currency: "NGN",
    image_url: String(form.get("image_url") ?? "") || null,
    stock_status: String(form.get("stock_status") ?? "in_stock")
  };

  const { error } = await supabase.from("products").insert(payload);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/");
  revalidatePath("/vendor/dashboard");
  return NextResponse.redirect(new URL("/vendor/dashboard", request.url));
}
