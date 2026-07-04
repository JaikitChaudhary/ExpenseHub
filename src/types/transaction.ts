import type { PaymentMode } from "./payment";

export type TransactionType = "expense" | "income";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  paymentMode: PaymentMode;
  note: string;
  tags: string[];
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
