import {
  BadgeIndianRupee,
  BadgePercent,
  Bath,
  BriefcaseBusiness,
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
  Plane,
  Plus,
  ReceiptText,
  RotateCcw,
  Shapes,
  ShoppingCart,
  Trash2,
  TrendingUp,
  Utensils,
  WalletCards,
  type LucideIcon
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCategories } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Category, CategoryType } from "@/types";

type VisibleType = "expense" | "income";

type CategoryFormState = {
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
};

const iconOptions: Array<{ name: string; icon: LucideIcon }> = [
  { name: "Utensils", icon: Utensils },
  { name: "Fuel", icon: Fuel },
  { name: "ShoppingCart", icon: ShoppingCart },
  { name: "HeartPulse", icon: HeartPulse },
  { name: "ReceiptText", icon: ReceiptText },
  { name: "GraduationCap", icon: GraduationCap },
  { name: "Gamepad2", icon: Gamepad2 },
  { name: "Bath", icon: Bath },
  { name: "Plane", icon: Plane },
  { name: "Milk", icon: Milk },
  { name: "House", icon: House },
  { name: "Landmark", icon: Landmark },
  { name: "TrendingUp", icon: TrendingUp },
  { name: "Gift", icon: Gift },
  { name: "Ellipsis", icon: Ellipsis },
  { name: "WalletCards", icon: WalletCards },
  { name: "BriefcaseBusiness", icon: BriefcaseBusiness },
  { name: "Laptop", icon: Laptop },
  { name: "BadgePercent", icon: BadgePercent },
  { name: "BadgeIndianRupee", icon: BadgeIndianRupee },
  { name: "RotateCcw", icon: RotateCcw },
  { name: "CircleEllipsis", icon: CircleEllipsis }
];

const iconMap = iconOptions.reduce<Record<string, LucideIcon>>((icons, option) => {
  icons[option.name] = option.icon;
  return icons;
}, {});

const colorOptions = [
  "#4F46E5",
  "#14B8A6",
  "#22C55E",
  "#84CC16",
  "#F59E0B",
  "#F97316",
  "#EF4444",
  "#EC4899",
  "#A855F7",
  "#38BDF8",
  "#60A5FA",
  "#94A3B8"
];

const initialFormState: CategoryFormState = {
  name: "",
  type: "expense",
  icon: "Shapes",
  color: "#4F46E5"
};

function getCategoryIcon(iconName: string) {
  return iconMap[iconName] ?? Shapes;
}

function typesOverlap(first: CategoryType, second: CategoryType) {
  return first === second || first === "both" || second === "both";
}

export function CategoriesPage() {
  const {
    categories,
    expenseCategories,
    incomeCategories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory
  } = useCategories();

  const [visibleType, setVisibleType] = useState<VisibleType>("expense");
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [formState, setFormState] = useState<CategoryFormState>(initialFormState);
  const [formError, setFormError] = useState<string | null>(null);

  const visibleCategories =
    visibleType === "expense" ? expenseCategories : incomeCategories;

  const sortedVisibleCategories = useMemo(
    () =>
      [...visibleCategories].sort((first, second) =>
        first.name.localeCompare(second.name)
      ),
    [visibleCategories]
  );

  function openAddDialog() {
    setSelectedCategory(null);
    setFormState({ ...initialFormState, type: visibleType });
    setFormError(null);
    setDialogMode("add");
  }

  function openEditDialog(category: Category) {
    if (category.isDefault) {
      return;
    }

    setSelectedCategory(category);
    setFormState({
      name: category.name,
      type: category.type,
      icon: category.icon,
      color: category.color
    });
    setFormError(null);
    setDialogMode("edit");
  }

  function closeCategoryDialog() {
    setDialogMode(null);
    setSelectedCategory(null);
    setFormError(null);
  }

  function getDuplicateCategory() {
    const normalizedName = formState.name.trim().toLowerCase();

    return categories.find((category) => {
      const sameName = category.name.trim().toLowerCase() === normalizedName;
      const sameCategory = category.id === selectedCategory?.id;
      return sameName && !sameCategory && typesOverlap(category.type, formState.type);
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = formState.name.trim();

    if (!name) {
      setFormError("Category name is required.");
      return;
    }

    if (getDuplicateCategory()) {
      setFormError("A category with this name already exists for this type.");
      return;
    }

    setFormError(null);

    if (dialogMode === "edit" && selectedCategory) {
      const updatedCategory = await updateCategory(selectedCategory.id, {
        name,
        type: formState.type,
        icon: formState.icon,
        color: formState.color
      });

      if (updatedCategory) {
        closeCategoryDialog();
      }

      return;
    }

    const createdCategory = await createCategory({
      name,
      type: formState.type,
      icon: formState.icon,
      color: formState.color,
      isDefault: false
    });

    if (createdCategory) {
      closeCategoryDialog();
    }
  }

  async function handleDeleteCategory() {
    if (!categoryToDelete || categoryToDelete.isDefault) {
      return;
    }

    const deleted = await deleteCategory(categoryToDelete.id);

    if (deleted) {
      setCategoryToDelete(null);
      closeCategoryDialog();
    }
  }

  return (
    <>
      <PageHeader title="Categories" />

      <section className="space-y-5">
        <div className="grid grid-cols-2 rounded-full bg-secondary p-1">
          {(["expense", "income"] as const).map((type) => (
            <button
              key={type}
              type="button"
              className={cn(
                "h-11 rounded-full text-sm font-bold capitalize text-muted-foreground transition-all duration-200",
                visibleType === type &&
                  "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              )}
              onClick={() => setVisibleType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {error && (
          <Card className="border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-600 dark:text-red-300">
            Something went wrong while loading categories.
          </Card>
        )}

        {loading && sortedVisibleCategories.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border bg-card">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : sortedVisibleCategories.length === 0 ? (
          <Card className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Shapes className="h-8 w-8" />
            </div>
            <p className="text-lg font-bold">No categories found.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {sortedVisibleCategories.map((category) => {
              const Icon = getCategoryIcon(category.icon);
              const editable = !category.isDefault;

              return (
                <button
                  key={category.id}
                  type="button"
                  className={cn(
                    "group min-h-36 rounded-2xl border bg-card p-4 text-left shadow-sm transition-all duration-200 active:scale-[0.98]",
                    editable
                      ? "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
                      : "cursor-default"
                  )}
                  onClick={() => openEditDialog(category)}
                >
                  <div
                    className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-sm transition-transform duration-200 group-hover:scale-105"
                    style={{ backgroundColor: category.color }}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <p className="line-clamp-2 text-base font-bold leading-tight">
                      {category.name}
                    </p>
                    {category.isDefault && (
                      <span className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                        Default
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <Button
        type="button"
        size="icon"
        aria-label="Add category"
        className="fixed bottom-24 right-5 z-30 h-16 w-16 shadow-2xl shadow-primary/30"
        onClick={openAddDialog}
      >
        <Plus className="h-8 w-8" />
      </Button>

      <Dialog
        open={dialogMode !== null}
        onOpenChange={(open) => {
          if (!open) {
            closeCategoryDialog();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "edit" ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription>
              Create a simple category for future expense tracking.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                value={formState.name}
                placeholder="Category name"
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    name: event.target.value
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Category Type</Label>
              <div className="grid grid-cols-3 rounded-full bg-secondary p-1">
                {(["expense", "income", "both"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={cn(
                      "h-10 rounded-full text-sm font-bold capitalize text-muted-foreground transition-all",
                      formState.type === type &&
                        "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    )}
                    onClick={() =>
                      setFormState((current) => ({ ...current, type }))
                    }
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Icon Picker</Label>
              <div className="grid grid-cols-6 gap-2">
                {[{ name: "Shapes", icon: Shapes }, ...iconOptions].map((option) => {
                  const Icon = option.icon;
                  const active = formState.icon === option.name;

                  return (
                    <button
                      key={option.name}
                      type="button"
                      aria-label={option.name}
                      className={cn(
                        "flex aspect-square items-center justify-center rounded-2xl border bg-background text-muted-foreground transition-all hover:border-primary/50 hover:text-primary",
                        active &&
                          "border-primary bg-primary text-primary-foreground hover:text-primary-foreground"
                      )}
                      onClick={() =>
                        setFormState((current) => ({
                          ...current,
                          icon: option.name
                        }))
                      }
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Color Picker</Label>
              <div className="grid grid-cols-6 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={color}
                    className={cn(
                      "aspect-square rounded-full border-4 border-card ring-2 ring-transparent transition-all",
                      formState.color === color && "scale-110 ring-primary"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() =>
                      setFormState((current) => ({ ...current, color }))
                    }
                  />
                ))}
              </div>
            </div>

            {formError && (
              <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-300">
                {formError}
              </p>
            )}

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={closeCategoryDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>

            {dialogMode === "edit" && selectedCategory && !selectedCategory.isDefault && (
              <Button
                type="button"
                variant="ghost"
                className="w-full text-red-600 hover:bg-red-500/10 hover:text-red-600 dark:text-red-300"
                onClick={() => setCategoryToDelete(selectedCategory)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Category
              </Button>
            )}
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={categoryToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCategoryToDelete(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              This action removes the custom category from ExpenseHub.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setCategoryToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={loading}
              onClick={handleDeleteCategory}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
