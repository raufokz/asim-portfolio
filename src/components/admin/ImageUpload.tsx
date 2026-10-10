"use client";

import { useRef, useState } from "react";
import { ImageUp, Loader2, Trash2 } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { Button, inputClass, labelClass } from "@/components/admin/ui";

const MAX_MB = 6;
const BUCKET = "media";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** Storage folder, e.g. "projects" or "before-after". */
  folder?: string;
  hint?: string;
};

function extension(file: File) {
  const fromName = file.name.includes(".") ? file.name.split(".").pop() : "";
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  return (file.type.split("/")[1] || "jpg").toLowerCase();
}

/**
 * Image field with direct upload to the Supabase Storage `media` bucket.
 * Also accepts a manually pasted path/URL for backwards compatibility.
 */
export default function ImageUpload({
  label,
  value,
  onChange,
  folder = "uploads",
  hint,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_MB} MB.`);
      return;
    }
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    setBusy(true);
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension(file)}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
    if (uploadError) {
      setBusy(false);
      setError(uploadError.message);
      return;
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    setBusy(false);
    onChange(data.publicUrl);
  };

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex gap-3">
        <div className="relative aspect-[4/3] w-36 shrink-0 overflow-hidden rounded-lg border border-ink/15 bg-ink/5">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-ink/25">
              <ImageUp className="h-6 w-6" />
            </div>
          )}
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <Loader2 className="h-5 w-5 animate-spin text-ink/60" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
            placeholder="/work/cover.jpg or upload a file"
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => inputRef.current?.click()} disabled={busy}>
              <ImageUp className="h-4 w-4" />
              {busy ? "Uploading…" : "Upload image"}
            </Button>
            {value && (
              <Button variant="ghost" onClick={() => onChange("")} disabled={busy}>
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
              e.target.value = "";
            }}
          />
          <p className={error ? "text-xs text-red-600" : "text-xs text-ink/45"}>
            {error ?? hint ?? `PNG, JPG, WEBP or GIF · max ${MAX_MB} MB`}
          </p>
        </div>
      </div>
    </div>
  );
}
