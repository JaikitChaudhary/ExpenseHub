import { useCallback, useEffect, useState } from "react";
import {
  categoryRepository,
  type CreateCategoryInput,
  type UpdateCategoryInput
} from "@/repositories";
import type { Category } from "@/types";
import { type HookError, runHookOperation } from "./hookHelpers";

export interface UseCategoriesResult {
  categories: Category[];
  expenseCategories: Category[];
  incomeCategories: Category[];
  loading: boolean;
  error: HookError;
  loadCategories: () => Promise<void>;
  createCategory: (category: CreateCategoryInput) => Promise<Category | undefined>;
  updateCategory: (
    id: string,
    category: UpdateCategoryInput
  ) => Promise<Category | undefined>;
  deleteCategory: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<HookError>(null);

  const loadCategories = useCallback(async () => {
    await runHookOperation(async () => {
      const [allCategories, expenses, incomes] = await Promise.all([
        categoryRepository.getAll(),
        categoryRepository.getExpenseCategories(),
        categoryRepository.getIncomeCategories()
      ]);

      setCategories(allCategories);
      setExpenseCategories(expenses);
      setIncomeCategories(incomes);
    }, setLoading, setError);
  }, []);

  const createCategory = useCallback(
    async (category: CreateCategoryInput) => {
      const createdCategory = await runHookOperation(
        () => categoryRepository.create(category),
        setLoading,
        setError
      );

      if (createdCategory) {
        await loadCategories();
      }

      return createdCategory;
    },
    [loadCategories]
  );

  const updateCategory = useCallback(
    async (id: string, category: UpdateCategoryInput) => {
      const updatedCategory = await runHookOperation(
        () => categoryRepository.update(id, category),
        setLoading,
        setError
      );

      if (updatedCategory) {
        await loadCategories();
      }

      return updatedCategory;
    },
    [loadCategories]
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      const deleted = await runHookOperation(async () => {
        await categoryRepository.delete(id);
        return true;
      }, setLoading, setError);

      if (deleted) {
        await loadCategories();
      }

      return Boolean(deleted);
    },
    [loadCategories]
  );

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  return {
    categories,
    expenseCategories,
    incomeCategories,
    loading,
    error,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    refresh: loadCategories
  };
}
