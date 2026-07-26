import { cn } from "@/lib/utils";

export function PageLoading({
  label = "Loading",
  tone = "light"
}: {
  label?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";

  return (
    <main
      className={cn("min-h-[70dvh]", dark ? "bg-[#0b0807]" : "bg-background")}
      aria-busy="true"
      aria-label={label}
    >
      <div className="container py-10">
        <span className="sr-only">{label}</span>
        <div
          className={cn("h-4 w-28 animate-pulse rounded-full", dark ? "bg-white/10" : "bg-muted")}
        />
        <div
          className={cn(
            "mt-5 h-10 w-full max-w-lg animate-pulse rounded-2xl",
            dark ? "bg-white/10" : "bg-muted"
          )}
        />
        <div
          className={cn(
            "mt-3 h-5 w-full max-w-2xl animate-pulse rounded-xl",
            dark ? "bg-white/10" : "bg-muted"
          )}
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-48 animate-pulse rounded-3xl border",
                dark ? "border-white/10 bg-white/[0.06]" : "border-border/70 bg-card"
              )}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
