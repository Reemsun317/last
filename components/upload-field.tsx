"use client";

import { ImagePlus } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type UploadFieldProps = {
  bucket: "business-images" | "product-images";
  name: string;
  label: string;
};

export function UploadField({ bucket, name, label }: UploadFieldProps) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatus("Uploading...");

    const supabase = createSupabaseBrowserClient();
    const path = `${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });

    if (error) {
      setStatus(error.message);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    setUrl(data.publicUrl);
    setStatus("Uploaded");
  }

  return (
    <label className="block rounded border border-dashed border-stone-300 bg-white p-4">
      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
        <ImagePlus className="h-4 w-4" />
        {label}
      </span>
      <input className="text-sm" type="file" accept="image/*" onChange={upload} />
      <input type="hidden" name={name} value={url} />
      {status ? <p className="mt-2 text-xs text-stone-600">{status}</p> : null}
      {url ? <p className="mt-1 break-all text-xs text-palm">{url}</p> : null}
    </label>
  );
}
