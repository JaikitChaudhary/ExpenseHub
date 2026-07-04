import Dexie, { type Table } from "dexie";
import type { Category, Metadata, Settings, Transaction } from "@/types";

export const DATABASE_NAME = "ExpenseHubDB";

export class ExpenseHubDatabase extends Dexie {
  transactions!: Table<Transaction, string>;
  categories!: Table<Category, string>;
  settings!: Table<Settings, string>;
  metadata!: Table<Metadata, string>;

  constructor() {
    super(DATABASE_NAME);

    this.version(1).stores({
      transactions:
        "id, type, categoryId, paymentMode, date, createdAt, updatedAt, *tags",
      categories: "id, name, type, isDefault, createdAt, updatedAt",
      settings: "id, theme, currency, language, createdAt, updatedAt",
      metadata: "key"
    });
  }
}

export const db = new ExpenseHubDatabase();
