import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * Contact-form backend.
 *
 * Priority:
 *   1. Supabase `inquiries` table (when configured) — the normal path.
 *   2. NEXT_PUBLIC_FORM_ENDPOINT (optional external form service).
 *   3. Honest demo response (501) — nothing is faked as "sent".
 */

type InquiryPayload = {
  name?: string;
  email?: string;
  company?: string;
  service?: string;
  budget?: string;
  deadline?: string;
  message?: string;
  /** Honeypot — must stay empty. */
  website?: string;
};

function validate(body: InquiryPayload) {
  const errors: Record<string, string> = {};
  if (!body.name || body.name.trim().length < 2) errors.name = "Please tell me your name.";
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (!body.service) errors.service = "Please choose a design service.";
  if (!body.message || body.message.trim().length < 10)
    errors.message = "A few more words about the project, please (min. 10 characters).";
  return errors;
}

export async function POST(request: Request) {
  let body: InquiryPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot: bots fill this field. Discard silently (return ok so bots move on;
  // no human ever sees this response and nothing is stored).
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const errors = validate(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed", errors }, { status: 422 });
  }

  const record = {
    name: body.name!.trim(),
    email: body.email!.trim(),
    company: body.company?.trim() || null,
    service: body.service!,
    budget: body.budget || null,
    deadline: body.deadline || null,
    message: body.message!.trim(),
  };

  // 1. Supabase
  const supabase = getSupabaseServer();
  if (supabase) {
    const { error } = await supabase.from("inquiries").insert(record);
    if (error) {
      console.error("Supabase inquiry insert failed:", error.message);
      return NextResponse.json({ error: "Database error — please try again or email directly." }, { status: 500 });
    }
    return NextResponse.json({ ok: true, demo: false });
  }

  // 2. External form endpoint (optional)
  const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT;
  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(record),
      });
      if (!res.ok) {
        return NextResponse.json({ error: "Upstream form service error" }, { status: 502 });
      }
      return NextResponse.json({ ok: true, demo: false });
    } catch {
      return NextResponse.json({ error: "Upstream form service unreachable" }, { status: 502 });
    }
  }

  // 3. Honest demo state — nothing was sent.
  return NextResponse.json(
    {
      ok: false,
      demo: true,
      message:
        "Demo mode — no form backend is configured, so this inquiry was NOT sent. Configure Supabase (see README) or set NEXT_PUBLIC_FORM_ENDPOINT.",
    },
    { status: 501 },
  );
}
