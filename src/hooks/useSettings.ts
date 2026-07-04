import { useCallback, useEffect, useState } from "react";
import { settingsRepository, type UpdateSettingsInput } from "@/repositories";
import type { Settings } from "@/types";
import { type HookError, runHookOperation } from "./hookHelpers";

export interface UseSettingsResult {
  settings: Settings | undefined;
  loading: boolean;
  error: HookError;
  loadSettings: () => Promise<void>;
  updateSettings: (settings: UpdateSettingsInput) => Promise<Settings | undefined>;
  resetSettings: () => Promise<Settings | undefined>;
  refresh: () => Promise<void>;
}

export function useSettings(): UseSettingsResult {
  const [settings, setSettings] = useState<Settings>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<HookError>(null);

  const loadSettings = useCallback(async () => {
    await runHookOperation(async () => {
      const currentSettings = await settingsRepository.get();
      setSettings(currentSettings);
    }, setLoading, setError);
  }, []);

  const updateSettings = useCallback(async (settingsUpdate: UpdateSettingsInput) => {
    const updatedSettings = await runHookOperation(
      () => settingsRepository.update(settingsUpdate),
      setLoading,
      setError
    );

    if (updatedSettings) {
      setSettings(updatedSettings);
    }

    return updatedSettings;
  }, []);

  const resetSettings = useCallback(async () => {
    const resetSettingsResult = await runHookOperation(
      () => settingsRepository.reset(),
      setLoading,
      setError
    );

    if (resetSettingsResult) {
      setSettings(resetSettingsResult);
    }

    return resetSettingsResult;
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    error,
    loadSettings,
    updateSettings,
    resetSettings,
    refresh: loadSettings
  };
}
