import {
  BadgeIndianRupee,
  BadgePercent,
  Bath,
  BriefcaseBusiness,
  CalendarDays,
  CircleEllipsis,
  Ellipsis,
  Fuel,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartPulse,
  House,
  Landmark,
  Laptop,
  Loader2,
  Milk,
  Plus,
  ReceiptText,
  RotateCcw,
  Search,
  Shapes,
  ShoppingCart,
  TrendingUp,
  Utensils,
  User,
  WalletCards,
  type LucideIcon
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCategories, useTransactions } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Category, Transaction } from "@/types";

type Period = "week" | "month" | "year";

const categoryIcons: Record<string, LucideIcon> = {
  Utensils,
  Fuel,
  ShoppingCart,
  HeartPulse,
  ReceiptText,
  GraduationCap,
  Gamepad2,
  Bath,
  Plane: CalendarDays,
  Milk,
  House,
  Landmark,
  TrendingUp,
  Gift,
  Ellipsis,
  WalletCards,
  BriefcaseBusiness,
  Laptop,
  BadgePercent,
  BadgeIndianRupee,
  RotateCcw,
  CircleEllipsis
};

const periodLabels: Record<Period, string> = {
  week: "This Week",
  month: "This Month",
  year: "This Year"
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const compactDateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short"
});

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  }

  if (hour < 17) {
    return "Good Afternoon";
  }

  return "Good Evening";
}

function getTransactionDate(transaction: Transaction) {
  return transaction.date instanceof Date
    ? transaction.date
    : new Date(transaction.date);
}

function getPeriodStart(period: Period) {
  const now = new Date();
  const start = new Date(now);

  if (period === "week") {
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;
    start.setDate(now.getDate() - diff);
  }

  if (period === "month") {
    start.setDate(1);
  }

  if (period === "year") {
    start.setMonth(0, 1);
  }

  start.setHours(0, 0, 0, 0);
  return start;
}

function getCategoryIcon(category: Category | undefined) {
  if (!category) {
    return Shapes;
  }

  return categoryIcons[category.icon] ?? Shapes;
}

export function HomePage() {
  const navigate = useNavigate();
  const { transactions, loading, error } = useTransactions();
  const { categories } = useCategories();
  const [period, setPeriod] = useState<Period>("month");

  const categoriesById = useMemo(() => {
    return new Map(categories.map((category) => [category.id, category]));
  }, [categories]);

  const filteredTransactions = useMemo(() => {
    const periodStart = getPeriodStart(period);
    const now = new Date();

    return transactions.filter((transaction) => {
      const transactionDate = getTransactionDate(transaction);
      return transactionDate >= periodStart && transactionDate <= now;
    });
  }, [period, transactions]);

  const totals = useMemo(() => {
    return filteredTransactions.reduce(
      (summary, transaction) => {
        if (transaction.type === "income") {
          return {
            ...summary,
            income: summary.income + transaction.amount
          };
        }

        return {
          ...summary,
          expense: summary.expense + transaction.amount
        };
      },
      { expense: 0, income: 0 }
    );
  }, [filteredTransactions]);

  const balance = totals.income - totals.expense;

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort(
        (first, second) =>
          getTransactionDate(second).getTime() - getTransactionDate(first).getTime()
      )
      .slice(0, 5);
  }, [transactions]);

  return (
    <>
      <header className="sticky top-0 z-30 -mx-4 mb-6 border-b border-border/40 bg-background/90 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-base font-medium text-muted-foreground">
              {getGreeting()},
            </p>
            <h1 className="truncate text-3xl font-bold tracking-normal text-foreground">
              ExpenseHub
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" size="icon" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <Avatar>
              <AvatarFallback aria-label="Placeholder profile avatar">
                <User className="h-5 w-5" aria-hidden="true" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <section className="space-y-6">
        {error && (
          <Card className="border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-600 dark:text-red-300">
            Something went wrong while loading transactions.
          </Card>
        )}

        <Card className="overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Cash Flow
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {periodLabels[period]}
              </p>
            </div>
            <div className="rounded-full bg-secondary p-1">
              <select
                value={period}
                aria-label="Select period"
                className="h-10 rounded-full border-0 bg-transparent px-3 text-sm font-bold text-foreground outline-none"
                onChange={(event) => setPeriod(event.target.value as Period)}
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-bold uppercase text-red-500">Expense</p>
              <p className="mt-2 break-words text-3xl font-bold">
                {currencyFormatter.format(totals.expense)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold uppercase text-emerald-500">Income</p>
              <p className="mt-2 break-words text-3xl font-bold">
                {currencyFormatter.format(totals.income)}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-muted/60 px-4 py-4">
            <span className="font-semibold text-muted-foreground">Balance</span>
            <span
              className={cn(
                "text-2xl font-bold",
                balance < 0 ? "text-red-500" : "text-emerald-500"
              )}
            >
              {currencyFormatter.format(balance)}
            </span>
          </div>
        </Card>

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-normal">Recent Transactions</h2>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/transactions")}
          >
            See All
          </Button>
        </div>

        {loading ? (
          <Card className="flex min-h-56 items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </Card>
        ) : recentTransactions.length === 0 ? (
          <Card className="flex min-h-72 flex-col items-center justify-center gap-5 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ReceiptText className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xl font-bold">No transactions yet</p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                Add your first transaction to see your cash flow.
              </p>
            </div>
            <Button type="button" onClick={() => navigate("/add")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </Card>
        ) : (
          <Card className="divide-y overflow-hidden">
            {recentTransactions.map((transaction) => {
              const category = categoriesById.get(transaction.categoryId);
              const Icon = getCategoryIcon(category);
              const isExpense = transaction.type === "expense";

              return (
                <div
                  key={transaction.id}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-accent/60"
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
                    style={{ backgroundColor: category?.color ?? "#4F46E5" }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-bold">
                      {category?.name ?? "Transaction"}
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-muted-foreground">
                      {transaction.paymentMode}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        "text-base font-bold",
                        isExpense ? "text-red-500" : "text-emerald-500"
                      )}
                    >
                      {isExpense ? "-" : "+"}
                      {currencyFormatter.format(transaction.amount)}
                    </p>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">
                      {compactDateFormatter.format(getTransactionDate(transaction))}
                    </p>
                  </div>
                </div>
              );
            })}
          </Card>
        )}
      </section>
    </>
  );
}
