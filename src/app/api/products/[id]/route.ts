import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type Params = {
  params: {
    id: string;
  };
};

export async function POST(request: Request, { params }: Params) {
  const form = await request.formData();
  const supabase = createSupabaseServerClient();

  const payload = {
    name: String(form.get("name") ?? ""),
    category: String(form.get("category") ?? ""),
    price: Number(form.get("price")),
    stock_status: String(form.get("stock_status") ?? "in_stock"),
    description: String(form.get("description") ?? "")
  };

  const { error } = await supabase.from("products").update(payload).eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/");
  revalidatePath("/vendor/dashboard");
  return NextResponse.redirect(new URL("/vendor/dashboard", request.url));
}
