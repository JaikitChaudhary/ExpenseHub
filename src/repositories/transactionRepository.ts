import type { Transaction } from "@/types";
import { db } from "@/lib/db";
import { createRepositoryId, runRepositoryOperation } from "./repositoryHelpers";

export type CreateTransactionInput = Omit<
  Transaction,
  "id" | "createdAt" | "updatedAt"
> &
  Partial<Pick<Transaction, "id" | "createdAt" | "updatedAt">>;

export type UpdateTransactionInput = Partial<
  Omit<Transaction, "id" | "createdAt" | "updatedAt">
>;

function buildTransaction(transaction: CreateTransactionInput): Transaction {
  const timestamp = new Date();

  return {
    id: transaction.id ?? createRepositoryId(),
    type: transaction.type,
    amount: transaction.amount,
    categoryId: transaction.categoryId,
    paymentMode: transaction.paymentMode,
    note: transaction.note,
    tags: transaction.tags,
    date: transaction.date,
    createdAt: transaction.createdAt ?? timestamp,
    updatedAt: transaction.updatedAt ?? timestamp
  };
}

export const transactionRepository = {
  getAll(): Promise<Transaction[]> {
    return runRepositoryOperation("transaction.getAll", () =>
      db.transactions.orderBy("date").reverse().toArray()
    );
  },

  getById(id: string): Promise<Transaction | undefined> {
    return runRepositoryOperation("transaction.getById", () =>
      db.transactions.get(id)
    );
  },

  create(transaction: CreateTransactionInput): Promise<Transaction> {
    return runRepositoryOperation("transaction.create", async () => {
      const newTransaction = buildTransaction(transaction);
      await db.transactions.add(newTransaction);
      return newTransaction;
    });
  },

  update(
    id: string,
    transaction: UpdateTransactionInput
  ): Promise<Transaction | undefined> {
    return runRepositoryOperation("transaction.update", async () => {
      const existingTransaction = await db.transactions.get(id);

      if (!existingTransaction) {
        return undefined;
      }

      const updatedTransaction: Transaction = {
        ...existingTransaction,
        ...transaction,
        id,
        createdAt: existingTransaction.createdAt,
        updatedAt: new Date()
      };

      await db.transactions.put(updatedTransaction);
      return updatedTransaction;
    });
  },

  delete(id: string): Promise<void> {
    return runRepositoryOperation("transaction.delete", () =>
      db.transactions.delete(id)
    );
  },

  deleteAll(): Promise<void> {
    return runRepositoryOperation("transaction.deleteAll", () =>
      db.transactions.clear()
    );
  },

  count(): Promise<number> {
    return runRepositoryOperation("transaction.count", () =>
      db.transactions.count()
    );
  }
};
