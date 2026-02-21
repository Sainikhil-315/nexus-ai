import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { signOut } from "@/lib/auth";
import { Infinity, Bell } from "lucide-react";
import Link from "next/link";

export default async function Header() {
  const session = await auth();

  return (
    <header className="border-b bg-background">
      <div className="flex h-14 items-center justify-between px-6">
        {/* Left: Logo */}
        <Link href="/home" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Infinity className="h-5 w-5 text-primary" />
          </div>
          <span className="font-semibold text-lg">NexusAI</span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Docs Link */}
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs">Docs</Link>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </Button>

          {/* User Profile */}
          {session?.user && (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                <span className="text-sm font-medium">
                  {(session.user.username || session.user.email || "U").charAt(0).toUpperCase()}
                </span>
              </div>
              <Badge variant="secondary" className="text-xs font-medium">
                PRO
              </Badge>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
