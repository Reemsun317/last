import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const allowedMetrics = new Set(["views", "whatsapp_clicks", "call_clicks", "direction_clicks"]);

export async function POST(request: Request) {
  const body = await request.json();
  const businessId = String(body.business_id ?? "");
  const metric = String(body.metric ?? "");

  if (!businessId || !allowedMetrics.has(metric)) {
    return NextResponse.json({ error: "Invalid metric request." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.rpc("increment_business_metric", {
    business_id_input: businessId,
    metric_name: metric
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
