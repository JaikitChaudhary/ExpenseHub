import type { Category, CategoryType } from "@/types";
import { db } from "@/lib/db";
import { createRepositoryId, runRepositoryOperation } from "./repositoryHelpers";

export type CreateCategoryInput = Omit<Category, "id" | "createdAt" | "updatedAt"> &
  Partial<Pick<Category, "id" | "createdAt" | "updatedAt">>;

export type UpdateCategoryInput = Partial<
  Omit<Category, "id" | "createdAt" | "updatedAt">
>;

function buildCategory(category: CreateCategoryInput): Category {
  const timestamp = new Date();

  return {
    id: category.id ?? createRepositoryId(),
    name: category.name,
    icon: category.icon,
    color: category.color,
    type: category.type,
    isDefault: category.isDefault,
    createdAt: category.createdAt ?? timestamp,
    updatedAt: category.updatedAt ?? timestamp
  };
}

function getCategoriesByType(type: CategoryType) {
  return db.categories.where("type").anyOf(type, "both").toArray();
}

export const categoryRepository = {
  getAll(): Promise<Category[]> {
    return runRepositoryOperation("category.getAll", () =>
      db.categories.orderBy("name").toArray()
    );
  },

  getExpenseCategories(): Promise<Category[]> {
    return runRepositoryOperation("category.getExpenseCategories", () =>
      getCategoriesByType("expense")
    );
  },

  getIncomeCategories(): Promise<Category[]> {
    return runRepositoryOperation("category.getIncomeCategories", () =>
      getCategoriesByType("income")
    );
  },

  getById(id: string): Promise<Category | undefined> {
    return runRepositoryOperation("category.getById", () => db.categories.get(id));
  },

  create(category: CreateCategoryInput): Promise<Category> {
    return runRepositoryOperation("category.create", async () => {
      const newCategory = buildCategory(category);
      await db.categories.add(newCategory);
      return newCategory;
    });
  },

  update(id: string, category: UpdateCategoryInput): Promise<Category | undefined> {
    return runRepositoryOperation("category.update", async () => {
      const existingCategory = await db.categories.get(id);

      if (!existingCategory) {
        return undefined;
      }

      const updatedCategory: Category = {
        ...existingCategory,
        ...category,
        id,
        createdAt: existingCategory.createdAt,
        updatedAt: new Date()
      };

      await db.categories.put(updatedCategory);
      return updatedCategory;
    });
  },

  delete(id: string): Promise<void> {
    return runRepositoryOperation("category.delete", () => db.categories.delete(id));
  },

  exists(name: string): Promise<boolean> {
    return runRepositoryOperation("category.exists", async () => {
      const category = await db.categories.where("name").equals(name).first();
      return Boolean(category);
    });
  }
};
