import {
  BadgeIndianRupee,
  BadgePercent,
  Banknote,
  Bath,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronsUpDown,
  CircleEllipsis,
  Clock3,
  CreditCard,
  Ellipsis,
  FileText,
  Fuel,
  Gamepad2,
  Gift,
  GraduationCap,
  Hash,
  HeartPulse,
  House,
  Landmark,
  Laptop,
  Loader2,
  Milk,
  Paperclip,
  Plane,
  ReceiptText,
  RotateCcw,
  Save,
  Shapes,
  ShoppingCart,
  Tag,
  TrendingUp,
  Utensils,
  Wallet,
  WalletCards,
  X,
  type LucideIcon
} from "lucide-react";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useState
} from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PAYMENT_MODES } from "@/constants";
import { useCategories, useTransactions } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Category, PaymentMode, TransactionType } from "@/types";

type TransactionFormState = {
  type: TransactionType;
  amount: string;
  date: string;
  time: string;
  categoryId: string;
  paymentMode: PaymentMode | "";
  note: string;
  tags: string[];
};

const categoryIcons: Record<string, LucideIcon> = {
  Utensils,
  Fuel,
  ShoppingCart,
  HeartPulse,
  ReceiptText,
  GraduationCap,
  Gamepad2,
  Bath,
  Plane,
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

const paymentIcons: Record<PaymentMode, LucideIcon> = {
  Cash: Banknote,
  UPI: Wallet,
  "Bank Account": Landmark,
  "Credit Card": CreditCard,
  "Debit Card": CreditCard,
  Wallet,
  Cheque: ReceiptText,
  Other: Ellipsis
};

function getDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTimeInputValue(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function createInitialFormState(): TransactionFormState {
  const now = new Date();

  return {
    type: "expense",
    amount: "",
    date: getDateInputValue(now),
    time: getTimeInputValue(now),
    categoryId: "",
    paymentMode: "",
    note: "",
    tags: []
  };
}

function createTransactionDate(date: string, time: string) {
  return new Date(`${date}T${time}`);
}

function normalizeTag(tag: string) {
  const trimmedTag = tag.trim().replace(/^#+/, "");
  return trimmedTag ? `#${trimmedTag}` : "";
}

function getCategoryIcon(category: Category) {
  return categoryIcons[category.icon] ?? Shapes;
}

export function AddTransactionPage() {
  const {
    expenseCategories,
    incomeCategories,
    loading: categoriesLoading,
    error: categoriesError
  } = useCategories();
  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
    createTransaction
  } = useTransactions();

  const [formState, setFormState] = useState<TransactionFormState>(
    createInitialFormState
  );
  const [tagInput, setTagInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const availableCategories =
    formState.type === "expense" ? expenseCategories : incomeCategories;

  const selectedCategory = availableCategories.find(
    (category) => category.id === formState.categoryId
  );

  const existingTags = useMemo(() => {
    const tagSet = new Set<string>();

    transactions.forEach((transaction) => {
      transaction.tags.forEach((tag) => tagSet.add(tag));
    });

    return [...tagSet].sort((first, second) => first.localeCompare(second));
  }, [transactions]);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage(null);
    }, 2600);

    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  function updateForm<Value extends keyof TransactionFormState>(
    key: Value,
    value: TransactionFormState[Value]
  ) {
    setFormState((current) => ({ ...current, [key]: value }));
    setFormError(null);
  }

  function handleAmountChange(value: string) {
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      updateForm("amount", value);
    }
  }

  function handleTypeChange(type: TransactionType) {
    setFormState((current) => ({
      ...current,
      type,
      categoryId: ""
    }));
    setFormError(null);
  }

  function addTag(rawTag: string) {
    const tag = normalizeTag(rawTag);

    if (!tag || formState.tags.includes(tag)) {
      return;
    }

    updateForm("tags", [...formState.tags, tag]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    updateForm(
      "tags",
      formState.tags.filter((currentTag) => currentTag !== tag)
    );
  }

  function handleTagKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter" && event.key !== ",") {
      return;
    }

    event.preventDefault();
    addTag(tagInput);
  }

  function resetForm() {
    setFormState(createInitialFormState());
    setTagInput("");
    setFormError(null);
  }

  function validateForm() {
    const amount = Number(formState.amount);

    if (!formState.amount.trim()) {
      return "Amount is required.";
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return "Amount must be greater than 0.";
    }

    if (!formState.categoryId) {
      return "Category is required.";
    }

    if (!formState.paymentMode) {
      return "Payment mode is required.";
    }

    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const pendingTag = normalizeTag(tagInput);
    const finalTags =
      pendingTag && !formState.tags.includes(pendingTag)
        ? [...formState.tags, pendingTag]
        : formState.tags;

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    const createdTransaction = await createTransaction({
      type: formState.type,
      amount: Number(formState.amount),
      categoryId: formState.categoryId,
      paymentMode: formState.paymentMode as PaymentMode,
      note: formState.note.trim(),
      tags: finalTags,
      date: createTransactionDate(formState.date, formState.time)
    });

    if (createdTransaction) {
      resetForm();
      setSuccessMessage("Transaction saved successfully.");
    }
  }

  return (
    <>
      <PageHeader title="Add Transaction" />

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 rounded-full bg-secondary p-1">
          {(["expense", "income"] as const).map((type) => (
            <button
              key={type}
              type="button"
              className={cn(
                "h-11 rounded-full text-sm font-bold capitalize text-muted-foreground transition-all duration-200",
                formState.type === type &&
                  "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              )}
              onClick={() => handleTypeChange(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {(formError || categoriesError || transactionsError) && (
          <Card className="border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-600 dark:text-red-300">
            {formError ?? "Something went wrong. Please try again."}
          </Card>
        )}

        {successMessage && (
          <div className="fixed left-4 right-4 top-4 z-[60] mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-xl">
            <Check className="h-5 w-5" />
            {successMessage}
          </div>
        )}

        <Card className="space-y-6 p-5">
          <div className="space-y-2">
            <Label htmlFor="transaction-amount">Transaction Amount</Label>
            <div className="flex items-center gap-3 rounded-2xl border bg-background px-4 py-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <span className="text-4xl font-bold text-muted-foreground">₹</span>
              <Input
                id="transaction-amount"
                inputMode="decimal"
                placeholder="0"
                value={formState.amount}
                className="h-16 border-0 bg-transparent px-0 text-5xl font-bold shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={(event) => handleAmountChange(event.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="transaction-date">Date</Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="transaction-date"
                  type="date"
                  value={formState.date}
                  className="pl-10"
                  onChange={(event) => updateForm("date", event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction-time">Time</Label>
              <div className="relative">
                <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="transaction-time"
                  type="time"
                  value={formState.time}
                  className="pl-10"
                  onChange={(event) => updateForm("time", event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <button
              type="button"
              className="flex h-14 w-full items-center justify-between rounded-2xl border bg-background px-4 text-left transition-colors hover:bg-accent"
              onClick={() => setCategoryDialogOpen(true)}
            >
              <span className="flex min-w-0 items-center gap-3">
                {selectedCategory ? (
                  <>
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
                      style={{ backgroundColor: selectedCategory.color }}
                    >
                      {(() => {
                        const Icon = getCategoryIcon(selectedCategory);
                        return <Icon className="h-5 w-5" />;
                      })()}
                    </span>
                    <span className="truncate font-bold">{selectedCategory.name}</span>
                  </>
                ) : (
                  <>
                    <Tag className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">
                      Select category
                    </span>
                  </>
                )}
              </span>
              <ChevronsUpDown className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-2">
            <Label>Payment Mode</Label>
            <button
              type="button"
              className="flex h-14 w-full items-center justify-between rounded-2xl border bg-background px-4 text-left transition-colors hover:bg-accent"
              onClick={() => setPaymentDialogOpen(true)}
            >
              <span className="flex items-center gap-3">
                {formState.paymentMode ? (
                  <>
                    {(() => {
                      const Icon = paymentIcons[formState.paymentMode];
                      return <Icon className="h-5 w-5 text-primary" />;
                    })()}
                    <span className="font-bold">{formState.paymentMode}</span>
                  </>
                ) : (
                  <>
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">
                      Select payment mode
                    </span>
                  </>
                )}
              </span>
              <ChevronsUpDown className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </Card>

        <Card className="space-y-5 p-5">
          <div className="space-y-2">
            <Label htmlFor="transaction-note">Notes</Label>
            <div className="relative">
              <FileText className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Textarea
                id="transaction-note"
                placeholder="Write a note"
                value={formState.note}
                className="pl-10"
                onChange={(event) => updateForm("note", event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="transaction-tags">Tags</Label>
            <div className="relative">
              <Hash className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="transaction-tags"
                placeholder="Add tags"
                value={tagInput}
                className="pl-10"
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => addTag(tagInput)}
              />
            </div>

            {formState.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formState.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    onClick={() => removeTag(tag)}
                  >
                    {tag}
                    <X className="h-4 w-4" />
                  </button>
                ))}
              </div>
            )}

            {existingTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {existingTags
                  .filter((tag) => !formState.tags.includes(tag))
                  .slice(0, 8)
                  .map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="rounded-full bg-secondary px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      onClick={() => addTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Attachment</Label>
            <div className="flex items-center gap-3 rounded-2xl border border-dashed bg-muted/30 p-4 text-muted-foreground">
              <Paperclip className="h-5 w-5" />
              <span className="text-sm font-semibold">Attachment placeholder</span>
            </div>
          </div>
        </Card>

        <Button
          type="submit"
          size="icon"
          aria-label="Save transaction"
          className="fixed bottom-24 right-5 z-30 h-16 w-16 shadow-2xl shadow-primary/30"
          disabled={transactionsLoading}
        >
          {transactionsLoading ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : (
            <Save className="h-7 w-7" />
          )}
        </Button>
      </form>

      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Category</DialogTitle>
            <DialogDescription>
              {formState.type === "expense"
                ? "Choose an expense category."
                : "Choose an income category."}
            </DialogDescription>
          </DialogHeader>

          {categoriesLoading ? (
            <div className="flex min-h-44 items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          ) : availableCategories.length === 0 ? (
            <div className="rounded-2xl border bg-muted/30 p-6 text-center text-sm font-semibold text-muted-foreground">
              No categories found.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {availableCategories.map((category) => {
                const Icon = getCategoryIcon(category);
                const active = category.id === formState.categoryId;

                return (
                  <button
                    key={category.id}
                    type="button"
                    className={cn(
                      "min-h-28 rounded-2xl border bg-background p-3 text-left transition-all active:scale-[0.98] hover:border-primary/50",
                      active && "border-primary bg-primary/10"
                    )}
                    onClick={() => {
                      updateForm("categoryId", category.id);
                      setCategoryDialogOpen(false);
                    }}
                  >
                    <span
                      className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="line-clamp-2 text-sm font-bold leading-tight">
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Payment Mode</DialogTitle>
            <DialogDescription>Choose how this transaction was paid.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            {PAYMENT_MODES.map((paymentMode) => {
              const Icon = paymentIcons[paymentMode];
              const active = paymentMode === formState.paymentMode;

              return (
                <button
                  key={paymentMode}
                  type="button"
                  className={cn(
                    "flex h-14 items-center justify-between rounded-2xl border bg-background px-4 transition-all hover:border-primary/50 hover:bg-accent",
                    active && "border-primary bg-primary/10"
                  )}
                  onClick={() => {
                    updateForm("paymentMode", paymentMode);
                    setPaymentDialogOpen(false);
                  }}
                >
                  <span className="flex items-center gap-3 font-bold">
                    <Icon className="h-5 w-5 text-primary" />
                    {paymentMode}
                  </span>
                  {active && <Check className="h-5 w-5 text-primary" />}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
