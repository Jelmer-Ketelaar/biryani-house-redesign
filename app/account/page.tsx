import Link from "next/link";
import { Gift, ShieldCheck, Sparkles, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";

const accountFeatures = [
  { icon: Gift, title: "Rewards", copy: "Track direct loyalty perks and high-value offers." },
  {
    icon: Sparkles,
    title: "Preferences",
    copy: "Save favorite spice levels, add-ons, and dietary needs."
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    copy: "Keep direct ordering details ready for faster checkout."
  }
];

export default async function AccountPage() {
  const session = await auth();

  return (
    <main className="container py-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow">Account</p>
        <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
          <section>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">
              Your Biryani House profile.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
              Manage direct ordering, saved preferences, loyalty rewards, and future order history
              from one polished customer hub.
            </p>
          </section>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
                  <UserRound className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-black">
                    {session?.user ? (session.user.name ?? "Signed in") : "Guest profile"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {session?.user ? session.user.email : "Sign in to unlock saved preferences"}
                  </p>
                </div>
              </div>
              <Button asChild className="mt-6 w-full">
                <Link href={session?.user ? "/menu" : "/auth/sign-in"}>
                  {session?.user ? "Order again" : "Sign in"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {accountFeatures.map(({ icon: Icon, title, copy }) => (
            <Card key={title}>
              <CardContent className="p-6">
                <Icon className="h-6 w-6 text-primary" />
                <h2 className="mt-4 text-xl font-black">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
