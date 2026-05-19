"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

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
    <div className="container flex min-h-[65dvh] flex-col items-start justify-center gap-4 py-10">
      <p className="eyebrow text-destructive">Something went wrong</p>
      <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
        We could not complete that action.
      </h1>
      <p className="max-w-xl text-lg leading-8 text-muted-foreground">
        Please retry. If the problem continues, the restaurant team can still help by phone.
      </p>
      <Button onClick={reset}>
        <RotateCcw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}
