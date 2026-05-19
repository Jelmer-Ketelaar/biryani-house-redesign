import Link from "next/link";
import { ArrowLeft, LockKeyhole, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  return (
    <main className="container grid min-h-[calc(100dvh-8rem)] items-center py-8">
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
            Sign in for faster checkout.
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Keep ordering preferences, loyalty rewards, and future order history connected to your
            Biryani House profile.
          </p>
        </section>

        <Card>
          <CardContent className="p-6 sm:p-8">
            <form className="space-y-5" action="/api/auth/callback/credentials" method="post">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="pl-11"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="pl-11"
                    required
                  />
                </div>
              </div>
              <Button className="w-full" size="lg" type="submit">
                Sign in
              </Button>
              <p className="text-center text-sm leading-6 text-muted-foreground">
                Credentials provider is configured. Add production auth providers when ready.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
