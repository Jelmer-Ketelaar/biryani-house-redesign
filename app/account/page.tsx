import Link from "next/link";
import { Leaf, MessageCircle, ShoppingBag, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { backendFetch } from "@/lib/backend/client";

export const metadata = {
  title: "Account",
  robots: { index: false, follow: false }
};

const accountFeatures = [
  {
    icon: ShoppingBag,
    title: "Direct menu",
    copy: "Browse current dishes, add-ons and availability."
  },
  {
    icon: Leaf,
    title: "Dietary details",
    copy: "Review halal, vegetarian, vegan and allergen labels while ordering."
  },
  {
    icon: MessageCircle,
    title: "Restaurant support",
    copy: "Contact the team directly when an order or reservation needs attention."
  }
];

export default async function AccountPage() {
  const session = await backendFetch<{
    user: { id: string; name: string | null; email: string; roles: string[] };
  }>("/api/auth/me", {}, { allowUnauthorized: true }).catch(() => null);

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-8 sm:py-12">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow">Account</p>
          <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
            <section>
              <h1 className="text-4xl font-black leading-tight sm:text-5xl">
                Your Biryani House profile.
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
                Sign in to your restaurant account or continue directly to the current menu.
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
                      {session?.user ? session.user.email : "Sign in to access your account"}
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
      </div>
    </main>
  );
}
