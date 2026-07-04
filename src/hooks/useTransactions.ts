import { useCallback, useEffect, useState } from "react";
import {
  transactionRepository,
  type CreateTransactionInput,
  type UpdateTransactionInput
} from "@/repositories";
import type { Transaction } from "@/types";
import { type HookError, runHookOperation } from "./hookHelpers";

export interface UseTransactionsResult {
  transactions: Transaction[];
  loading: boolean;
  error: HookError;
  loadTransactions: () => Promise<void>;
  createTransaction: (
    transaction: CreateTransactionInput
  ) => Promise<Transaction | undefined>;
  updateTransaction: (
    id: string,
    transaction: UpdateTransactionInput
  ) => Promise<Transaction | undefined>;
  deleteTransaction: (id: string) => Promise<boolean>;
  deleteAllTransactions: () => Promise<boolean>;
  countTransactions: () => Promise<number | undefined>;
  refresh: () => Promise<void>;
}

export function useTransactions(): UseTransactionsResult {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<HookError>(null);

  const loadTransactions = useCallback(async () => {
    await runHookOperation(async () => {
      const transactionList = await transactionRepository.getAll();
      setTransactions(transactionList);
    }, setLoading, setError);
  }, []);

  const createTransaction = useCallback(
    async (transaction: CreateTransactionInput) => {
      const createdTransaction = await runHookOperation(
        () => transactionRepository.create(transaction),
        setLoading,
        setError
      );

      if (createdTransaction) {
        await loadTransactions();
      }

      return createdTransaction;
    },
    [loadTransactions]
  );

  const updateTransaction = useCallback(
    async (id: string, transaction: UpdateTransactionInput) => {
      const updatedTransaction = await runHookOperation(
        () => transactionRepository.update(id, transaction),
        setLoading,
        setError
      );

      if (updatedTransaction) {
        await loadTransactions();
      }

      return updatedTransaction;
    },
    [loadTransactions]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      const deleted = await runHookOperation(async () => {
        await transactionRepository.delete(id);
        return true;
      }, setLoading, setError);

      if (deleted) {
        await loadTransactions();
      }

      return Boolean(deleted);
    },
    [loadTransactions]
  );

  const deleteAllTransactions = useCallback(async () => {
    const deleted = await runHookOperation(async () => {
      await transactionRepository.deleteAll();
      return true;
    }, setLoading, setError);

    if (deleted) {
      await loadTransactions();
    }

    return Boolean(deleted);
  }, [loadTransactions]);

  const countTransactions = useCallback(() => {
    return runHookOperation(
      () => transactionRepository.count(),
      setLoading,
      setError
    );
  }, []);

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  return {
    transactions,
    loading,
    error,
    loadTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    deleteAllTransactions,
    countTransactions,
    refresh: loadTransactions
  };
}
