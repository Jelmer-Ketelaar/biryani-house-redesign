"use client";

import { useEffect } from "react";
import { Phone, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { restaurant } from "@/lib/restaurant/content";

export default function GlobalError({
  error,
  reset
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[65dvh] bg-background">
      <div className="container flex min-h-[65dvh] flex-col items-start justify-center gap-4 py-10">
        <p className="eyebrow text-destructive">Something went wrong</p>
        <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
          We could not complete that action.
        </h1>
        <p className="max-w-xl text-lg leading-8 text-muted-foreground">
          Please retry. If the problem continues, the restaurant team can still help by phone.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            Try again
          </Button>
          <Button asChild variant="outline">
            <a href={`tel:${restaurant.phone.replaceAll(" ", "")}`}>
              <Phone className="h-4 w-4" />
              Call restaurant
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}
