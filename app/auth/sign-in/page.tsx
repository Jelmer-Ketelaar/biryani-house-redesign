import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { SignInForm } from "@/components/auth/sign-in-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Sign In",
  robots: { index: false, follow: false }
};

export default async function SignInPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const nextPath = (await searchParams).next;
  const redirectTo = nextPath === "/admin/orders" ? nextPath : "/account";

  return (
    <main className="min-h-[calc(100dvh-8rem)] bg-background">
      <div className="container grid min-h-[calc(100dvh-8rem)] items-center py-8">
        <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <section>
            <Button asChild variant="ghost" className="-ml-4 mb-5">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back home
              </Link>
            </Button>
            <p className="eyebrow">Customer access</p>
            <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
              Access your account.
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Enter your Biryani House account details. You can also browse the menu and place an
              order as a guest.
            </p>
          </section>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <SignInForm redirectTo={redirectTo} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
