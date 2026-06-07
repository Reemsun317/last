import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type Params = {
  params: {
    id: string;
  };
};

export async function POST(request: Request, { params }: Params) {
  const authClient = createSupabaseServerClient();
  const { data: auth } = await authClient.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { data: role } = await authClient
    .from("user_roles")
    .select("role")
    .eq("user_id", auth.user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!role) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const form = await request.formData();
  const update: Record<string, unknown> = {};

  if (form.has("status")) update.status = String(form.get("status"));
  if (form.has("verified")) update.verified = form.get("verified") === "true";

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("businesses").update(update).eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return NextResponse.redirect(new URL("/admin", request.url));
}
