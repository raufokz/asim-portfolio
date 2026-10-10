"use client";

import { useEffect, useState } from "react";
import { AlertCircle, ArrowUpRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { serviceCategories, type Service } from "@/data/services";
import type { SiteConfig } from "@/lib/content";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "demo" | "success" | "error";

type FormFields = {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  deadline: string;
  message: string;
  /** Honeypot — must stay empty. */
  website: string;
};

type Errors = Partial<Record<"name" | "email" | "service" | "message", string>>;

const emptyForm: FormFields = {
  name: "",
  email: "",
  company: "",
  service: "",
  budget: "",
  deadline: "",
  message: "",
  website: "",
};

const budgets = ["Under $500", "$500 – $1,500", "$1,500 – $5,000", "$5,000+", "Not sure yet"];
const deadlines = ["Flexible", "Within 2 weeks", "Within a month", "1–3 months", "3+ months"];

const inputClass =
  "w-full rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm text-ink transition-colors placeholder:text-ink/35 focus:border-ink focus:outline-none focus:ring-2 focus:ring-lime";
const labelClass = "label mb-2 block text-ink/55";

export default function Contact({
  settings,
  services,
}: {
  settings: SiteConfig;
  services: Service[];
}) {
  const [form, setForm] = useState<FormFields>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  // Service cards dispatch this event to pre-select a service.
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (id) setForm((f) => ({ ...f, service: id }));
    };
    window.addEventListener("asim:inquire", handler);
    return () => window.removeEventListener("asim:inquire", handler);
  }, []);

  const set = (field: keyof FormFields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): Errors => {
    const errs: Errors = {};
    if (form.name.trim().length < 2) errs.name = "Please tell me your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errs.email = "Please enter a valid email address.";
    if (!form.service) errs.service = "Please choose a design service.";
    if (form.message.trim().length < 10)
      errs.message = "A few more words about the project, please (min. 10 characters).";
    return errs;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Honeypot: bots fill this; the API discards it silently.
    if (form.website) {
      setStatus("demo");
      return;
    }
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm(emptyForm);
        return;
      }
      if (res.status === 501) {
        // Honest demo state: no backend configured, nothing was sent.
        setStatus("demo");
        return;
      }
      if (res.status === 422) {
        const body = await res.json();
        if (body?.errors) setErrors(body.errors as Errors);
        setStatus("idle");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="grain bg-ink py-24 text-paper lg:py-32">
      <div className="container-slim grid gap-14 lg:grid-cols-2 lg:gap-16">
        {/* Left: pitch */}
        <div>
          <p className="label text-paper/55">
            <span className="text-lime">✦</span> (08) — Contact
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,4.6vw,3.8rem)] font-bold leading-[1.05] tracking-[-0.02em]">
            Have a Good Idea?{" "}
            <span className="marker">Let’s Make It Look Incredible.</span>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-paper/65">
            Tell me about your brand, your project, and your deadline. I read every inquiry
            personally and usually reply within one to two business days.
          </p>

          <a
            href={`mailto:${settings.email}`}
            className="mt-9 inline-flex items-center gap-3 font-display text-xl font-bold text-lime underline-offset-8 hover:underline sm:text-2xl"
          >
            <Mail className="h-6 w-6 shrink-0" />
            {settings.email}
          </a>

          <ul className="mt-9 flex flex-wrap gap-2.5">
            {settings.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.url}
                  className="rounded-full border border-paper/20 px-4 py-2 text-sm font-semibold text-paper/80 transition-colors hover:border-lime hover:bg-lime hover:text-ink"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-8 flex items-center gap-2.5 text-sm text-paper/60">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime" />
            </span>
            {settings.availability}
          </p>
        </div>

        {/* Right: form */}
        <form
          onSubmit={onSubmit}
          noValidate
          className="rounded-2xl bg-paper p-6 text-ink shadow-xl sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="cf-name" className={labelClass}>
                Name *
              </label>
              <input
                id="cf-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={set("name")}
                className={inputClass}
                placeholder="Your name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "cf-name-error" : undefined}
              />
              {errors.name && (
                <p id="cf-name-error" className="mt-1.5 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="cf-email" className={labelClass}>
                Email *
              </label>
              <input
                id="cf-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={set("email")}
                className={inputClass}
                placeholder="you@company.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "cf-email-error" : undefined}
              />
              {errors.email && (
                <p id="cf-email-error" className="mt-1.5 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="cf-company" className={labelClass}>
                Company / Brand
              </label>
              <input
                id="cf-company"
                name="company"
                type="text"
                autoComplete="organization"
                value={form.company}
                onChange={set("company")}
                className={inputClass}
                placeholder="Optional"
              />
            </div>

            <div>
              <label htmlFor="cf-service" className={labelClass}>
                Design service *
              </label>
              <select
                id="cf-service"
                name="service"
                required
                value={form.service}
                onChange={set("service")}
                className={cn(inputClass, "appearance-none")}
                aria-invalid={!!errors.service}
                aria-describedby={errors.service ? "cf-service-error" : undefined}
              >
                <option value="" disabled>
                  Select a service…
                </option>
                {serviceCategories.map((cat) => (
                  <optgroup key={cat.id} label={cat.label}>
                    {services
                      .filter((s) => s.category === cat.id)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
              {errors.service && (
                <p id="cf-service-error" className="mt-1.5 text-xs text-red-600">{errors.service}</p>
              )}
            </div>

            <div>
              <label htmlFor="cf-budget" className={labelClass}>
                Budget range
              </label>
              <select
                id="cf-budget"
                name="budget"
                value={form.budget}
                onChange={set("budget")}
                className={cn(inputClass, "appearance-none")}
              >
                <option value="" disabled>
                  Select a range…
                </option>
                {budgets.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="cf-deadline" className={labelClass}>
                Deadline
              </label>
              <select
                id="cf-deadline"
                name="deadline"
                value={form.deadline}
                onChange={set("deadline")}
                className={cn(inputClass, "appearance-none")}
              >
                <option value="" disabled>
                  Select a timeline…
                </option>
                {deadlines.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="cf-message" className={labelClass}>
              Project brief / message *
            </label>
            <textarea
              id="cf-message"
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={set("message")}
              className={cn(inputClass, "resize-y")}
              placeholder="What are we designing? Goals, audience, references, anything that helps…"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "cf-message-error" : undefined}
            />
            {errors.message && (
              <p id="cf-message-error" className="mt-1.5 text-xs text-red-600">{errors.message}</p>
            )}
          </div>

          {/* Honeypot — hidden from humans, bots tend to fill it */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="cf-website">Website (leave empty)</label>
            <input
              id="cf-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={set("website")}
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 font-display font-bold text-paper transition-colors hover:bg-lime hover:text-ink disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                Send Inquiry
                <ArrowUpRight className="h-5 w-5" />
              </>
            )}
          </button>

          {/* Honest status feedback */}
          <div aria-live="polite" className="mt-4">
            {status === "demo" && (
              <p className="flex gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span>
                  <strong>Demo mode — nothing was sent.</strong> This site has no form backend
                  configured yet. Set up Supabase (see README.md → “Supabase backend”) or set{" "}
                  <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono">
                    NEXT_PUBLIC_FORM_ENDPOINT
                  </code>{" "}
                  in <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono">.env.local</code>.
                </span>
              </p>
            )}
            {status === "success" && (
              <p className="flex gap-3 rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-900">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <span>
                  <strong>Thank you — your inquiry has been sent.</strong> I’ll get back to you
                  within one to two business days.
                </span>
              </p>
            )}
            {status === "error" && (
              <p className="flex gap-3 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-900">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span>
                  <strong>Something went wrong while sending.</strong> Please try again, or email
                  me directly at{" "}
                  <a href={`mailto:${settings.email}`} className="font-semibold underline">
                    {settings.email}
                  </a>
                  .
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
