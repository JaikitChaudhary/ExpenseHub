import type { Settings } from "@/types";
import { db, seedDefaultSettings } from "@/lib/db";
import { DEFAULT_SETTINGS_ID, defaultSettings } from "@/lib/db/seeds";
import { runRepositoryOperation } from "./repositoryHelpers";

export type UpdateSettingsInput = Partial<
  Omit<Settings, "id" | "createdAt" | "updatedAt">
>;

function createDefaultSettings(timestamp: Date): Settings {
  return {
    ...defaultSettings,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

export const settingsRepository = {
  get(): Promise<Settings | undefined> {
    return runRepositoryOperation("settings.get", async () => {
      await seedDefaultSettings();
      return db.settings.get(DEFAULT_SETTINGS_ID);
    });
  },

  update(settings: UpdateSettingsInput): Promise<Settings> {
    return runRepositoryOperation("settings.update", async () => {
      const timestamp = new Date();
      const currentSettings =
        (await db.settings.get(DEFAULT_SETTINGS_ID)) ?? createDefaultSettings(timestamp);

      const updatedSettings: Settings = {
        ...currentSettings,
        ...settings,
        id: DEFAULT_SETTINGS_ID,
        createdAt: currentSettings.createdAt,
        updatedAt: timestamp
      };

      await db.settings.put(updatedSettings);
      return updatedSettings;
    });
  },

  reset(): Promise<Settings> {
    return runRepositoryOperation("settings.reset", async () => {
      const timestamp = new Date();
      const settings = createDefaultSettings(timestamp);
      await db.settings.clear();
      await db.settings.add(settings);
      return settings;
    });
  }
};
