"use client";

import { useMemo, type FormEvent } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { restaurant } from "@/lib/restaurant/content";
import { cn } from "@/lib/utils";

export function ReservationForm() {
  const minimumDate = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  function continueInWhatsApp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [
      `Hello ${restaurant.shortName}, I would like to request a reservation.`,
      "",
      `Name: ${data.get("name")}`,
      `Date: ${data.get("date")}`,
      `Time: ${data.get("time")}`,
      `Guests: ${data.get("guests")}`,
      `Dining: ${data.get("occasion")}`,
      `Phone: ${data.get("phone")}`,
      `Email: ${data.get("email")}`,
      data.get("notes") ? `Notes: ${data.get("notes")}` : ""
    ]
      .filter(Boolean)
      .join("\n");

    window.location.assign(
      `https://wa.me/${restaurant.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    );
  }

  return (
    <form className="mt-6 grid gap-5" onSubmit={continueInWhatsApp}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="reservation-name"
          name="name"
          label="Name"
          placeholder="Your name"
          autoComplete="name"
          required
        />
        <Field
          id="reservation-phone"
          name="phone"
          label="Phone"
          type="tel"
          placeholder="+31"
          autoComplete="tel"
          required
        />
      </div>
      <Field
        id="reservation-email"
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        required
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          id="reservation-date"
          name="date"
          label="Date"
          type="date"
          min={minimumDate}
          required
        />
        <Field id="reservation-time" name="time" label="Time" type="time" required />
        <Field
          id="reservation-guests"
          name="guests"
          label="Guests"
          type="number"
          min={1}
          max={200}
          placeholder="2"
          inputMode="numeric"
          required
        />
      </div>
      <label className="block text-sm font-black text-[#fff7e8]" htmlFor="occasion">
        Dining option
        <select
          id="occasion"
          name="occasion"
          className="mt-2 min-h-12 w-full rounded-2xl border border-white/15 bg-[#1b120e] px-4 text-sm text-[#fff7e8] focus-visible:border-[#d99a2b]/60 focus-visible:ring-2 focus-visible:ring-[#d99a2b]/30"
        >
          <option>A la carte dinner</option>
          <option>Buffet reservation</option>
          <option>Group or celebration</option>
        </select>
      </label>
      <label className="block text-sm font-black text-[#fff7e8]" htmlFor="reservation-notes">
        Notes <span className="font-semibold text-[#f8e6c8]/55">(optional)</span>
        <textarea
          id="reservation-notes"
          name="notes"
          rows={4}
          maxLength={500}
          placeholder="Dietary needs, children, celebration details or preferred seating"
          className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3 text-sm text-[#fff7e8] placeholder:text-[#f8e6c8]/40 focus-visible:border-[#d99a2b]/60 focus-visible:ring-2 focus-visible:ring-[#d99a2b]/30"
        />
      </label>

      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
        {["Halal cuisine", "Buffet and a la carte", "Groups and families welcome"].map((item) => (
          <p
            key={item}
            className="text-[#f8e6c8]/74 flex items-center gap-2 py-1 text-sm font-bold"
          >
            <CheckCircle2 className="h-4 w-4 text-[#d99a2b]" />
            {item}
          </p>
        ))}
      </div>

      <div>
        <Button
          type="submit"
          size="lg"
          className="w-full bg-[#25d366] text-[#071f0e] hover:bg-[#4ade80] sm:w-auto"
        >
          <MessageCircle className="h-4 w-4" />
          Continue in WhatsApp
        </Button>
        <p className="mt-3 text-sm leading-6 text-[#f8e6c8]/60">
          Your details will be added to a WhatsApp message. The reservation is confirmed only after
          the restaurant replies.
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
}) {
  return (
    <label className={cn("block text-sm font-black text-[#fff7e8]", className)} htmlFor={id}>
      {label}
      <input
        id={id}
        className="mt-2 min-h-12 w-full rounded-2xl border border-white/15 bg-white/[0.07] px-4 text-sm text-[#fff7e8] placeholder:text-[#f8e6c8]/40 focus-visible:border-[#d99a2b]/60 focus-visible:ring-2 focus-visible:ring-[#d99a2b]/30"
        {...props}
      />
    </label>
  );
}
