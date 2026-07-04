import { BarChart3, Grid2X2, Home, PlusCircle, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/analysis", label: "Analysis", icon: BarChart3 },
  { to: "/add", label: "Add Transaction", icon: PlusCircle },
  { to: "/categories", label: "Categories", icon: Grid2X2 },
  { to: "/settings", label: "Settings", icon: Settings }
];

export function BottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-2xl shadow-slate-950/15 backdrop-blur-xl dark:shadow-black/40">
      <div className="mx-auto grid max-w-2xl grid-cols-5 items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              aria-label={item.label}
              className={({ isActive }) =>
                cn(
                  "group flex h-12 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 ease-out hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                )
              }
            >
              <Icon className="h-6 w-6 transition-transform duration-200 group-hover:scale-105" />
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
