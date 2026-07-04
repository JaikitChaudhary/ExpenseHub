import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const themes = [
  { value: "light", label: "Light theme", icon: Sun },
  { value: "dark", label: "Dark theme", icon: Moon },
  { value: "system", label: "System theme", icon: Laptop }
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center rounded-full border border-border bg-card p-1 shadow-sm">
      {themes.map((item) => {
        const Icon = item.icon;
        const active = theme === item.value;
        return (
          <Button
            key={item.value}
            type="button"
            variant="ghost"
            size="icon"
            aria-label={item.label}
            aria-pressed={active}
            title={item.label}
            className={cn(
              "h-9 w-9 text-muted-foreground hover:text-foreground",
              active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            )}
            onClick={() => setTheme(item.value)}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </Button>
        );
      })}
    </div>
  );
}
