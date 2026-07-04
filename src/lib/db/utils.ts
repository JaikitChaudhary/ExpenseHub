import type { Category, Settings } from "@/types";
import { db } from "./database";
import { defaultCategorySeeds, defaultSettings } from "./seeds";

function createId() {
  return crypto.randomUUID();
}

function createDefaultCategory(
  seed: Pick<Category, "name" | "icon" | "color" | "type">,
  timestamp: Date
): Category {
  return {
    id: createId(),
    ...seed,
    isDefault: true,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

function createDefaultSettings(timestamp: Date): Settings {
  return {
    ...defaultSettings,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

export async function seedDefaultSettings() {
  const settingsCount = await db.settings.count();

  if (settingsCount > 0) {
    return;
  }

  const timestamp = new Date();
  await db.settings.add(createDefaultSettings(timestamp));
}

export async function seedDefaultCategories() {
  const categoryCount = await db.categories.count();

  if (categoryCount > 0) {
    return;
  }

  const timestamp = new Date();
  const categories = defaultCategorySeeds.map((seed) =>
    createDefaultCategory(seed, timestamp)
  );

  await db.categories.bulkAdd(categories);
}

export async function initializeDatabase() {
  await db.open();
  await seedDefaultSettings();
  await seedDefaultCategories();
}

export async function clearTransactions() {
  await db.transactions.clear();
}

export async function resetDatabase() {
  await db.transaction("rw", db.transactions, db.categories, db.settings, db.metadata, async () => {
    await db.transactions.clear();
    await db.categories.clear();
    await db.settings.clear();
    await db.metadata.clear();
  });

  await seedDefaultSettings();
  await seedDefaultCategories();
}
