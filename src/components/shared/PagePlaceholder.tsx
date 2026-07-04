import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PagePlaceholderProps = {
  title: string;
};

export function PagePlaceholder({ title }: PagePlaceholderProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-primary/14 via-card to-card">
        <CardDescription className="font-semibold uppercase tracking-[0.18em] text-primary">
          ExpenseHub
        </CardDescription>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-dashed border-border bg-muted/35 p-6 text-sm font-medium text-muted-foreground">
          Foundation placeholder
        </div>
      </CardContent>
    </Card>
  );
}
