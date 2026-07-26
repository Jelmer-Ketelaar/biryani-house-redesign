"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Loader2, LockKeyhole, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function SignInForm({
  redirectTo = "/account",
  showHelperText = true,
  tone = "light"
}: {
  redirectTo?: string;
  showHelperText?: boolean;
  tone?: "light" | "dark";
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10_000),
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password")
        })
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error?.message ?? "Sign-in failed");
      router.push(redirectTo);
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof DOMException && caught.name === "TimeoutError"
          ? "Sign-in took too long. Check your connection and try again."
          : caught instanceof Error
            ? caught.message
            : "Sign-in failed"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={submit}>
      <div className="space-y-2">
        <Label htmlFor="email" className={tone === "dark" ? "text-[#fff7e8]" : undefined}>
          Email
        </Label>
        <div className="relative">
          <Mail
            className={cn(
              "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2",
              tone === "dark" ? "text-[#f8e6c8]/50" : "text-muted-foreground"
            )}
          />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={cn(
              "pl-11",
              tone === "dark" &&
                "border-white/15 bg-white/[0.07] text-[#fff7e8] shadow-none placeholder:text-[#f8e6c8]/35 focus:border-[#d99a2b]/60 focus:ring-[#d99a2b]/25 focus:ring-offset-[#120c09]"
            )}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className={tone === "dark" ? "text-[#fff7e8]" : undefined}>
          Password
        </Label>
        <div className="relative">
          <LockKeyhole
            className={cn(
              "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2",
              tone === "dark" ? "text-[#f8e6c8]/50" : "text-muted-foreground"
            )}
          />
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className={cn(
              "pl-11",
              tone === "dark" &&
                "border-white/15 bg-white/[0.07] text-[#fff7e8] shadow-none placeholder:text-[#f8e6c8]/35 focus:border-[#d99a2b]/60 focus:ring-[#d99a2b]/25 focus:ring-offset-[#120c09]"
            )}
            required
          />
        </div>
      </div>
      {error ? (
        <p
          role="alert"
          className={cn("text-sm font-bold", tone === "dark" ? "text-red-300" : "text-destructive")}
        >
          {error}
        </p>
      ) : null}
      <Button
        className={cn(
          "w-full",
          tone === "dark" && "bg-[#d99a2b] text-[#1a100b] hover:bg-[#efb44c]"
        )}
        size="lg"
        type="submit"
        disabled={submitting}
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Sign in
      </Button>
      {showHelperText ? (
        <p
          className={cn(
            "text-center text-sm leading-6",
            tone === "dark" ? "text-[#f8e6c8]/60" : "text-muted-foreground"
          )}
        >
          Sign in to access your restaurant account.
        </p>
      ) : null}
    </form>
  );
}
