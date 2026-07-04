import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

type PageHeaderProps = {
  title?: string;
  home?: boolean;
};

export function PageHeader({ title, home = false }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-30 -mx-4 mb-6 border-b border-border/40 bg-background/90 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
      {home ? (
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">Good day,</p>
            <h1 className="truncate text-3xl font-bold tracking-normal text-foreground">
              ExpenseHub
            </h1>
            <p className="mt-1 text-sm font-medium text-primary">Track. Analyze. Grow.</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Avatar>
              <AvatarFallback aria-label="Placeholder profile avatar">
                <User className="h-5 w-5" aria-hidden="true" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <h1 className="truncate text-3xl font-bold tracking-normal text-foreground">
            {title}
          </h1>
          <ThemeToggle />
        </div>
      )}
    </header>
  );
}
