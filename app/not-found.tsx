import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="min-h-[65dvh] bg-background">
      <div className="container flex min-h-[65dvh] flex-col items-start justify-center gap-4 py-10">
        <p className="eyebrow">404</p>
        <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl">Page not found</h1>
        <p className="max-w-xl text-lg leading-8 text-muted-foreground">
          The page may have moved or the menu item is unavailable.
        </p>
        <Button asChild>
          <Link href="/menu">
            Browse the menu
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
