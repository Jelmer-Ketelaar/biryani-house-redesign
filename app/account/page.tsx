import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Leaf,
  MessageCircle,
  ShoppingBag,
  UserRound
} from "lucide-react";

import { SignInForm } from "@/components/auth/sign-in-form";
import { SignOutButton } from "@/components/auth/sign-out-button";
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
    title: "Order directly",
    copy: "Browse current dishes, customize add-ons and see availability before checkout."
  },
  {
    icon: Leaf,
    title: "Choose confidently",
    copy: "Dietary labels, spice levels and allergen details help you find the right dish."
  },
  {
    icon: MessageCircle,
    title: "Get human support",
    copy: "Contact the restaurant directly when an order or reservation needs attention."
  }
];

const accountBenefits = [
  "Guest ordering remains available",
  "Live menu prices and availability",
  "Direct restaurant support"
];

export default async function AccountPage() {
  const session = await backendFetch<{
    user: { id: string; name: string | null; email: string; roles: string[] };
  }>("/api/auth/me", {}, { allowUnauthorized: true }).catch(() => null);
  const user = session?.user;

  return (
    <main className="bg-[#0b0807] text-[#fff7e8]">
      <section className="border-b border-white/10 bg-[#0b0807]">
        <div className="container py-8 sm:py-10 lg:py-12">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:gap-12">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d99a2b]">
                Biryani House account
              </p>
              <h1 className="mt-3 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                {user
                  ? `Welcome back${user.name ? `, ${user.name}` : ""}.`
                  : "Your next order starts here."}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[#f8e6c8]/70">
                {user
                  ? "Your account is ready. Continue to the live menu and build your next order."
                  : "Sign in to your Biryani House account, or continue as a guest without slowing down your order."}
              </p>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="mt-6 border-white/15 bg-white/[0.06] text-[#fff7e8] shadow-none hover:border-[#d99a2b]/45 hover:bg-white/10"
              >
                <Link href="/menu">
                  Browse menu as guest
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <Card className="overflow-hidden border-white/10 bg-[#120c09] text-[#fff7e8] shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
              {user ? (
                <SignedInPanel name={user.name} email={user.email} />
              ) : (
                <>
                  <div className="border-b border-white/10 bg-[#d99a2b]/10 px-6 py-5 sm:px-7">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#d99a2b] text-[#1a100b] shadow-sm">
                        <UserRound className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="text-xl font-black">Sign in</h2>
                        <p className="mt-0.5 text-sm text-[#f8e6c8]/60">
                          Access your restaurant account
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 sm:p-7">
                    <SignInForm showHelperText={false} tone="dark" />
                  </CardContent>
                </>
              )}
            </Card>

            <div className="grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3 lg:col-span-2">
              {accountBenefits.map((benefit) => (
                <p
                  key={benefit}
                  className="text-[#f8e6c8]/68 flex items-center gap-2.5 text-sm font-semibold"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#d99a2b]" />
                  {benefit}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-8 sm:py-10">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/[0.055] px-5 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:px-7 sm:py-7">
          <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start lg:gap-10">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d99a2b]">
                Simple by design
              </p>
              <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
                Everything you need to order with confidence.
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {accountFeatures.map(({ icon: Icon, title, copy }, index) => (
                <article
                  key={title}
                  className={
                    index > 0
                      ? "border-t border-white/10 pt-6 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0"
                      : ""
                  }
                >
                  <Icon className="h-5 w-5 text-[#d99a2b]" />
                  <h3 className="mt-3 font-black">{title}</h3>
                  <p className="text-[#f8e6c8]/64 mt-2 text-sm leading-6">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SignedInPanel({ name, email }: { name: string | null; email: string }) {
  return (
    <>
      <div className="border-b border-white/10 bg-[#d99a2b]/10 px-6 py-5 sm:px-7">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d99a2b]">Signed in</p>
        <h2 className="mt-2 text-xl font-black">{name ?? "Your account"}</h2>
        <p className="mt-1 break-all text-sm text-[#f8e6c8]/60">{email}</p>
      </div>
      <CardContent className="space-y-3 p-6 sm:p-7">
        <Button asChild size="lg" className="w-full bg-[#d99a2b] text-[#1a100b] hover:bg-[#efb44c]">
          <Link href="/menu">
            Start an order
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <SignOutButton tone="dark" />
      </CardContent>
    </>
  );
}
