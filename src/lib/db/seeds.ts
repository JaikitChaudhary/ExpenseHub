import type { Category, Settings } from "@/types";

type CategorySeed = Pick<Category, "name" | "icon" | "color" | "type">;

export const DEFAULT_SETTINGS_ID = "default";

export const defaultSettings: Settings = {
  id: DEFAULT_SETTINGS_ID,
  currency: "INR",
  theme: "system",
  language: "en",
  dateFormat: "DD MMM YYYY",
  timeFormat: "12h",
  firstDayOfWeek: "monday",
  createdAt: new Date(),
  updatedAt: new Date()
};

export const defaultCategorySeeds: CategorySeed[] = [
  { name: "Food & Dining", icon: "Utensils", color: "#F97316", type: "expense" },
  { name: "Fuel", icon: "Fuel", color: "#A855F7", type: "expense" },
  { name: "Shopping", icon: "ShoppingCart", color: "#38BDF8", type: "expense" },
  { name: "Medical", icon: "HeartPulse", color: "#EF4444", type: "expense" },
  { name: "Bills", icon: "ReceiptText", color: "#F43F5E", type: "expense" },
  { name: "Education", icon: "GraduationCap", color: "#C084FC", type: "expense" },
  { name: "Entertainment", icon: "Gamepad2", color: "#22C55E", type: "expense" },
  { name: "Personal Care", icon: "Bath", color: "#FB7185", type: "expense" },
  { name: "Travel", icon: "Plane", color: "#8B5CF6", type: "expense" },
  { name: "Groceries", icon: "Milk", color: "#14B8A6", type: "expense" },
  { name: "Rent", icon: "House", color: "#60A5FA", type: "expense" },
  { name: "EMI", icon: "Landmark", color: "#10B981", type: "expense" },
  { name: "Investment", icon: "TrendingUp", color: "#84CC16", type: "expense" },
  { name: "Gift", icon: "Gift", color: "#EC4899", type: "expense" },
  { name: "Others", icon: "Ellipsis", color: "#94A3B8", type: "expense" },
  { name: "Salary", icon: "WalletCards", color: "#22C55E", type: "income" },
  { name: "Business", icon: "BriefcaseBusiness", color: "#0EA5E9", type: "income" },
  { name: "Freelance", icon: "Laptop", color: "#6366F1", type: "income" },
  { name: "Interest", icon: "BadgePercent", color: "#14B8A6", type: "income" },
  { name: "Bonus", icon: "BadgeIndianRupee", color: "#F59E0B", type: "income" },
  { name: "Refund", icon: "RotateCcw", color: "#06B6D4", type: "income" },
  { name: "Others", icon: "CircleEllipsis", color: "#CBD5E1", type: "income" }
];
