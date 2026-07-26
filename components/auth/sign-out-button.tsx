"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SignOutButton({ tone = "light" }: { tone?: "light" | "dark" }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signOut() {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        signal: AbortSignal.timeout(10_000)
      });
      if (!response.ok) throw new Error("We could not sign you out.");
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof DOMException && caught.name === "TimeoutError"
          ? "Signing out took too long. Please try again."
          : caught instanceof Error
            ? caught.message
            : "We could not sign you out."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className={cn(
          "w-full",
          tone === "dark" &&
            "border-white/15 bg-white/[0.06] text-[#fff7e8] shadow-none hover:border-[#d99a2b]/45 hover:bg-white/10"
        )}
        disabled={submitting}
        onClick={signOut}
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
        Sign out
      </Button>
      {error ? (
        <p
          role="alert"
          className={cn(
            "mt-3 text-sm font-bold",
            tone === "dark" ? "text-red-300" : "text-destructive"
          )}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
