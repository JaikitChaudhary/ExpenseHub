import type { ReactNode } from "react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col">
        <main className="flex-1 px-4 pb-28 pt-4 sm:px-6">{children}</main>
        <BottomNavigation />
      </div>
    </div>
  );
}
